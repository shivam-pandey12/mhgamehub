(function attachGameHubAnalytics() {
    "use strict";

    const SESSION_KEY = "gamehubAnalyticsSessionId";
    const DEDUPE_KEY = "gamehubAnalyticsDedupe";
    const SHARED_TICKET_KEY = "gamehubPremium.sharedTicket";
    const EVENT_ENDPOINT = "/api/signals/event";
    const REQUEST_TIMEOUT_MS = 3500;
    const EVENT_WINDOWS = {
        page_view: 30000,
        game_view: 30000,
        game_play_start: 60000
    };
    const memoryDedupe = {};

    function readJsonStorage(storage, key) {
        try {
            const raw = storage?.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    function writeJsonStorage(storage, key, value) {
        try {
            storage?.setItem(key, JSON.stringify(value));
        } catch (_) {
            // Analytics must never break the page.
        }
    }

    function getAnonymousSessionId() {
        let existing = "";
        try {
            existing = String(window.localStorage?.getItem(SESSION_KEY) || "").trim();
        } catch (_) {
            existing = "";
        }
        if (existing) {
            return existing;
        }

        const random = window.crypto?.getRandomValues
            ? Array.from(window.crypto.getRandomValues(new Uint8Array(12)), (part) => part.toString(16).padStart(2, "0")).join("")
            : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        const id = `ghan_${random}`;
        try {
            window.localStorage?.setItem(SESSION_KEY, id);
        } catch (_) {
            // Keep the generated value for this call only.
        }
        return id;
    }

    function withTimeout(promise, timeoutMs) {
        let timer = 0;
        const timeout = new Promise((_, reject) => {
            timer = window.setTimeout(() => reject(new Error("Timed out")), timeoutMs);
        });
        return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
    }

    function readSharedTicket() {
        if (window.GameHubPremium?.loadSharedTicket) {
            return window.GameHubPremium.loadSharedTicket();
        }
        return readJsonStorage(window.localStorage, SHARED_TICKET_KEY);
    }

    async function getPremiumTicketToken() {
        try {
            if (window.GameHubPremiumAuth?.exchangeSessionTicket) {
                const ticket = await withTimeout(window.GameHubPremiumAuth.exchangeSessionTicket(false), 900);
                return String(ticket?.token || "").trim();
            }
        } catch (_) {
            // Optional identity only.
        }

        const sharedTicket = readSharedTicket();
        if (Number(sharedTicket?.expiresAt || 0) > Date.now()) {
            return String(sharedTicket?.token || "").trim();
        }
        return "";
    }

    function cleanSource(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (!raw) {
            return "";
        }
        if (raw.includes("google")) {
            return "google";
        }
        if (raw.includes("youtu")) {
            return "youtube";
        }
        if (raw.includes("instagram")) {
            return "instagram";
        }
        if (raw.includes("facebook") || raw === "fb") {
            return "facebook";
        }
        if (raw.includes("whatsapp") || raw === "wa") {
            return "whatsapp";
        }
        if (raw.includes("github")) {
            return "github";
        }
        if (raw.includes("bing")) {
            return "bing";
        }
        if (raw.includes("twitter") || raw === "x" || raw.includes("t.co")) {
            return "twitter";
        }
        if (raw === "direct" || raw === "none") {
            return "direct";
        }
        return "other";
    }

    function getReferrerDomain(referrer) {
        try {
            return referrer ? new URL(referrer).hostname.replace(/^www\./i, "").toLowerCase() : "";
        } catch (_) {
            return "";
        }
    }

    function detectSource() {
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get("utm_source");
        if (utmSource) {
            return cleanSource(utmSource);
        }

        const domain = getReferrerDomain(document.referrer);
        return cleanSource(domain) || "direct";
    }

    function detectDeviceType() {
        const ua = navigator.userAgent || "";
        const coarse = window.matchMedia?.("(pointer: coarse)").matches || false;
        const width = Math.min(window.innerWidth || 0, window.screen?.width || window.innerWidth || 0);
        if (/ipad|tablet|kindle|silk/i.test(ua) || (coarse && width >= 700 && width <= 1200)) {
            return "tablet";
        }
        if (/mobi|iphone|android/i.test(ua) || (coarse && width < 700)) {
            return "mobile";
        }
        return "desktop";
    }

    function getDedupeState() {
        return readJsonStorage(window.sessionStorage, DEDUPE_KEY) || memoryDedupe;
    }

    function setDedupeState(state) {
        Object.assign(memoryDedupe, state);
        writeJsonStorage(window.sessionStorage, DEDUPE_KEY, state);
    }

    function dedupeKey(eventType, payload) {
        if (eventType === "game_view" || eventType === "game_play_start") {
            return `${eventType}:${payload.gameSlug || ""}:${payload.path || ""}`;
        }
        return `${eventType}:${payload.path || ""}`;
    }

    function shouldSkipDuplicate(eventType, payload) {
        const windowMs = EVENT_WINDOWS[eventType] || 30000;
        const key = dedupeKey(eventType, payload);
        const now = Date.now();
        const state = getDedupeState();
        const previous = Number(state[key] || 0);
        if (previous && now - previous < windowMs) {
            return true;
        }

        state[key] = now;
        Object.keys(state).forEach((entry) => {
            if (now - Number(state[entry] || 0) > 5 * 60 * 1000) {
                delete state[entry];
            }
        });
        setDedupeState(state);
        return false;
    }

    function normalizeGame(game = {}) {
        return {
            gameSlug: String(game.id || game.gameSlug || game.slug || "").trim(),
            gameTitle: String(game.name || game.gameTitle || game.title || "").trim()
        };
    }

    function buildPayload(eventType, details = {}) {
        const params = new URLSearchParams(window.location.search);
        const game = normalizeGame(details);
        return {
            eventType,
            path: details.path || `${window.location.pathname}${window.location.search}`,
            title: details.title || document.title || "GameHub",
            gameSlug: details.gameSlug || game.gameSlug,
            gameTitle: details.gameTitle || game.gameTitle,
            source: details.source || detectSource(),
            medium: details.medium || params.get("utm_medium") || "",
            campaign: details.campaign || params.get("utm_campaign") || "",
            referrer: document.referrer || "",
            deviceType: details.deviceType || detectDeviceType(),
            anonymousSessionId: getAnonymousSessionId(),
            metadata: {
                ...(details.metadata && typeof details.metadata === "object" ? details.metadata : {}),
                isAdminTraffic: details.isAdminTraffic === true || window.location.pathname.startsWith("/admin")
            }
        };
    }

    function sendWithBeacon(payload) {
        if (!navigator.sendBeacon) {
            return false;
        }
        try {
            const body = new Blob([JSON.stringify(payload)], {
                type: "application/json"
            });
            return navigator.sendBeacon(EVENT_ENDPOINT, body);
        } catch (_) {
            return false;
        }
    }

    async function sendWithFetch(payload, token = "") {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            await fetch(EVENT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                cache: "no-store",
                keepalive: true,
                body: JSON.stringify(payload),
                signal: controller.signal
            });
        } catch (_) {
            // Analytics is best-effort only.
        } finally {
            window.clearTimeout(timer);
        }
    }

    async function track(eventType, details = {}) {
        try {
            const payload = buildPayload(eventType, details);
            if (shouldSkipDuplicate(eventType, payload)) {
                return;
            }

            const token = await getPremiumTicketToken();
            if (!token && sendWithBeacon(payload)) {
                return;
            }
            await sendWithFetch(payload, token);
        } catch (_) {
            // Never interrupt gameplay or navigation.
        }
    }

    function trackPageView(details = {}) {
        void track("page_view", details);
    }

    function trackGameView(game = {}, details = {}) {
        void track("game_view", {
            ...normalizeGame(game),
            ...details
        });
    }

    function trackGamePlayStart(game = {}, details = {}) {
        void track("game_play_start", {
            ...normalizeGame(game),
            ...details
        });
    }

    function autoTrackPageView() {
        trackPageView({
            isAdminTraffic: window.location.pathname.startsWith("/admin")
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", autoTrackPageView, { once: true });
    } else {
        autoTrackPageView();
    }

    window.GameHubAnalytics = {
        track,
        trackPageView,
        trackGameView,
        trackGamePlayStart,
        getAnonymousSessionId,
        detectSource,
        detectDeviceType
    };
})();
