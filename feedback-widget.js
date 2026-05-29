(function attachGameHubFeedback() {
    "use strict";

    const SESSION_KEY = "gamehubFeedbackSessionId";
    const SHARED_TICKET_KEY = "gamehubPremium.sharedTicket";
    const SHARED_IDENTITY_KEY = "gamehubPremium.sharedIdentity";
    const REQUEST_TIMEOUT_MS = 8000;

    let context = {};
    let modal = null;
    let triggerButton = null;
    let previousFocus = null;

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        }[character]));
    }

    function readJsonStorage(key) {
        try {
            const raw = window.localStorage?.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    function writeSessionId(id) {
        try {
            window.localStorage?.setItem(SESSION_KEY, id);
        } catch (_) {
            // Anonymous session persistence is best-effort only.
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
        const id = `ghfb_${random}`;
        writeSessionId(id);
        return id;
    }

    function withTimeout(promise, timeoutMs) {
        let timer = 0;
        const timeout = new Promise((_, reject) => {
            timer = window.setTimeout(() => reject(new Error("Timed out")), timeoutMs);
        });
        return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
    }

    function getSharedIdentity() {
        if (window.GameHubPremium?.loadSharedIdentity) {
            return window.GameHubPremium.loadSharedIdentity();
        }
        return readJsonStorage(SHARED_IDENTITY_KEY);
    }

    function getSharedTicket() {
        if (window.GameHubPremium?.loadSharedTicket) {
            return window.GameHubPremium.loadSharedTicket();
        }
        return readJsonStorage(SHARED_TICKET_KEY);
    }

    async function findKnownEmail() {
        try {
            if (window.GameHubPremiumAuth?.ready) {
                const session = await withTimeout(window.GameHubPremiumAuth.ready(), 1500);
                if (session?.user?.email) {
                    return session.user.email;
                }
            }
        } catch (_) {
            // Feedback stays anonymous when premium auth is not ready.
        }

        const identity = getSharedIdentity();
        return identity?.email || "";
    }

    async function getPremiumTicketToken() {
        try {
            if (window.GameHubPremiumAuth?.exchangeSessionTicket) {
                const ticket = await withTimeout(window.GameHubPremiumAuth.exchangeSessionTicket(false), 2500);
                return String(ticket?.token || "").trim();
            }
        } catch (_) {
            // A failed ticket refresh must not block anonymous feedback.
        }

        const sharedTicket = getSharedTicket();
        if (Number(sharedTicket?.expiresAt || 0) > Date.now()) {
            return String(sharedTicket?.token || "").trim();
        }
        return "";
    }

    function inferGameContext() {
        const params = new URLSearchParams(window.location.search);
        const titleNode = document.querySelector("#premium-game-title, #game-title, [data-game-title]");
        const rawTitle = titleNode?.textContent || document.title || "GameHub";
        return {
            gameSlug: context.gameSlug || params.get("id") || document.body.dataset.gameSlug || "",
            gameTitle: context.gameTitle || rawTitle.replace(/\s+\|\s+GameHub.*$/i, "").trim(),
            path: window.location.pathname + window.location.search
        };
    }

    function setStatus(message, tone = "muted") {
        const node = modal?.querySelector("[data-feedback-status]");
        if (!node) {
            return;
        }
        node.textContent = message || "";
        node.dataset.tone = tone;
        node.hidden = !message;
    }

    function setLoading(loading) {
        const submit = modal?.querySelector("[data-feedback-submit]");
        if (!submit) {
            return;
        }
        submit.disabled = Boolean(loading);
        submit.querySelector("span").textContent = loading ? "Sending..." : "Send feedback";
    }

    function closeModal() {
        if (!modal) {
            return;
        }
        modal.hidden = true;
        document.body.classList.remove("gamehub-feedback-open");
        setStatus("");
        const form = modal.querySelector("form");
        form?.reset();
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    async function openModal() {
        ensureModal();
        previousFocus = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("gamehub-feedback-open");
        setStatus("");
        const contact = modal.querySelector("[name='contactEmail']");
        if (contact && !contact.value) {
            contact.value = await findKnownEmail();
        }
        modal.querySelector("[name='type']")?.focus();
    }

    function buildButton(isPremium) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `${isPremium ? "premium-control-button" : "control-button"} gamehub-feedback-trigger`;
        button.setAttribute("data-gamehub-feedback-trigger", "true");
        button.innerHTML = isPremium
            ? `${window.GameHubPremium?.icon?.("ticket") || ""}<span>Feedback</span>`
            : `<i class="fas fa-comment-dots" aria-hidden="true"></i> Feedback`;
        button.addEventListener("click", () => {
            void openModal();
        });
        return button;
    }

    function installButton() {
        if (document.querySelector("[data-gamehub-feedback-trigger]")) {
            triggerButton = document.querySelector("[data-gamehub-feedback-trigger]");
            return;
        }

        const premiumTarget = document.querySelector(".premium-header-actions");
        const publicTarget = document.querySelector(".header-actions");
        const target = premiumTarget || publicTarget;
        const isPremium = Boolean(premiumTarget);
        triggerButton = buildButton(isPremium);

        if (target) {
            target.appendChild(triggerButton);
            window.GameHubPremium?.hydrateIcons?.(triggerButton);
            return;
        }

        triggerButton.classList.add("gamehub-feedback-floating");
        document.body.appendChild(triggerButton);
    }

    function ensureModal() {
        if (modal) {
            return modal;
        }

        modal = document.createElement("div");
        modal.className = "gamehub-feedback-modal";
        modal.hidden = true;
        modal.innerHTML = `
            <div class="gamehub-feedback-backdrop" data-feedback-close></div>
            <section class="gamehub-feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="gamehub-feedback-title">
                <button class="gamehub-feedback-close" type="button" data-feedback-close aria-label="Close feedback">X</button>
                <p class="gamehub-feedback-kicker">GameHub Feedback</p>
                <h2 id="gamehub-feedback-title">Send feedback</h2>
                <form class="gamehub-feedback-form">
                    <label>
                        <span>Type</span>
                        <select name="type" required>
                            <option value="feedback">Feedback</option>
                            <option value="bug">Bug</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="report">Report</option>
                        </select>
                    </label>
                    <label>
                        <span>Rating</span>
                        <select name="rating">
                            <option value="">Optional</option>
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 star</option>
                        </select>
                    </label>
                    <label class="gamehub-feedback-wide">
                        <span>Message</span>
                        <textarea name="message" maxlength="2000" minlength="5" required placeholder="Tell us what happened or what could be better."></textarea>
                    </label>
                    <label class="gamehub-feedback-wide">
                        <span>Contact email</span>
                        <input name="contactEmail" type="email" maxlength="180" placeholder="Optional">
                    </label>
                    <p class="gamehub-feedback-status" data-feedback-status hidden></p>
                    <div class="gamehub-feedback-actions">
                        <button class="gamehub-feedback-secondary" type="button" data-feedback-close>Cancel</button>
                        <button class="gamehub-feedback-primary" type="submit" data-feedback-submit>
                            <span>Send feedback</span>
                        </button>
                    </div>
                </form>
            </section>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll("[data-feedback-close]").forEach((button) => {
            button.addEventListener("click", closeModal);
        });
        modal.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
            void submitFeedback(event.currentTarget);
        });
        return modal;
    }

    async function submitFeedback(form) {
        const formData = new FormData(form);
        const message = String(formData.get("message") || "").trim();
        if (message.length < 5) {
            setStatus("Please enter at least 5 characters.", "error");
            return;
        }
        if (message.length > 2000) {
            setStatus("Message must be 2000 characters or fewer.", "error");
            return;
        }

        const inferred = inferGameContext();
        const payload = {
            type: formData.get("type"),
            rating: formData.get("rating") || null,
            message,
            contactEmail: formData.get("contactEmail") || "",
            gameSlug: inferred.gameSlug,
            gameTitle: inferred.gameTitle,
            path: inferred.path,
            anonymousSessionId: getAnonymousSessionId()
        };

        setLoading(true);
        setStatus("");
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const token = await getPremiumTicketToken();
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                cache: "no-store",
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result?.ok) {
                throw new Error(result?.error || "Could not send feedback. Please try again.");
            }
            setStatus("Thanks, your feedback was sent.", "success");
            form.reset();
            window.setTimeout(closeModal, 1200);
        } catch (_) {
            setStatus("Could not send feedback. Please try again.", "error");
        } finally {
            window.clearTimeout(timeout);
            setLoading(false);
        }
    }

    function setGameContext(nextContext = {}) {
        context = {
            ...context,
            ...nextContext
        };
    }

    function install(nextContext = {}) {
        setGameContext(nextContext);
        installButton();
        ensureModal();
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && !modal.hidden) {
            closeModal();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        install();
    });

    window.GameHubFeedback = {
        install,
        open: openModal,
        setGameContext,
        close: closeModal,
        escapeHtml
    };
})();
