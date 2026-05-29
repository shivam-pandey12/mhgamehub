(function () {
    "use strict";

    const AUTH_WAIT_MS = 5000;
    const REQUEST_WAIT_MS = 8000;

    function wait(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function withTimeout(promise, ms, message) {
        let timer = 0;
        const timeout = new Promise((_, reject) => {
            timer = window.setTimeout(() => reject(new Error(message)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
    }

    async function waitForPremiumAuth() {
        const startedAt = Date.now();
        while (Date.now() - startedAt < AUTH_WAIT_MS) {
            if (window.GameHubPremiumAuth?.ready) {
                return window.GameHubPremiumAuth;
            }
            await wait(100);
        }
        return null;
    }

    async function requestAdminMe(ticketToken) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), REQUEST_WAIT_MS);
        try {
            const response = await fetch("/api/admin/me", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ticketToken}`
                },
                cache: "no-store",
                signal: controller.signal
            });
            const payload = await response.json().catch(() => ({}));
            return { response, payload };
        } finally {
            window.clearTimeout(timer);
        }
    }

    async function checkAdmin() {
        const authClient = await waitForPremiumAuth();
        if (!authClient) {
            return {
                state: "login-required",
                reason: "Premium auth is not available."
            };
        }

        let session = null;
        try {
            session = await withTimeout(authClient.ready(), AUTH_WAIT_MS, "Premium auth did not become ready.");
        } catch (error) {
            return {
                state: "login-required",
                reason: error?.message || "Premium auth could not be loaded."
            };
        }

        if (!session?.authenticated) {
            return {
                state: "login-required",
                session,
                reason: "Admin login required."
            };
        }

        let ticket = null;
        try {
            ticket = await withTimeout(
                authClient.exchangeSessionTicket(true),
                REQUEST_WAIT_MS,
                "Premium session refresh timed out."
            );
        } catch (error) {
            return {
                state: "login-required",
                session,
                reason: error?.message || "Premium session could not be refreshed."
            };
        }

        const token = String(ticket?.token || "").trim();
        if (!token) {
            return {
                state: "login-required",
                session,
                reason: "Premium session ticket is missing."
            };
        }

        try {
            const { response, payload } = await requestAdminMe(token);
            if (response.ok && payload?.admin === true) {
                return {
                    state: "admin",
                    email: payload.email || session.user?.email || "",
                    token,
                    session,
                    payload
                };
            }
            if (response.status === 403) {
                return {
                    state: "access-denied",
                    email: payload?.email || session.user?.email || "",
                    token,
                    session,
                    payload
                };
            }
            return {
                state: "login-required",
                email: session.user?.email || "",
                session,
                payload,
                reason: payload?.error || "Admin login required."
            };
        } catch (error) {
            return {
                state: "login-required",
                email: session.user?.email || "",
                session,
                reason: error?.message || "Admin verification failed."
            };
        }
    }

    window.GameHubAdminAccess = {
        checkAdmin
    };
})();
