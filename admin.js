(function () {
    "use strict";

    const MODULES = [
        ["overview", "Overview", "High-level GameHub admin summary.", "grid"],
        ["analytics", "Analytics", "Traffic, plays, source, and device reporting.", "wave"],
        ["games", "Catalog Ops", "Catalog visibility, launch labels, priority, and maintenance controls.", "gamepad"],
        ["feedback", "Feedback", "Player feedback and bug report management.", "ticket"],
        ["moderation", "Moderation", "Reports, temporary restrictions, and safe room controls.", "shield"],
        ["users", "Users", "Account and member safety views.", "user"],
        ["access", "Access/Unlocks", "Premium access and unlock visibility.", "key"],
        ["realtime", "Realtime", "Live rooms, sockets, and matchmaking queues.", "radar"],
        ["system", "System", "Server health and safe runtime logs.", "shield"],
        ["audit", "Audit Logs", "Admin support action history.", "layers"],
        ["settings", "Operations", "Global banner, maintenance mode, and feature flags.", "clock"]
    ].map(([id, label, description, iconName]) => ({
        id,
        label,
        title: label,
        description,
        iconName,
        phase: id === "feedback"
            ? "Feedback reports are connected in Phase 2."
            : (id === "moderation"
                ? "Moderation and safe room controls are connected in Phase 7."
            : (id === "analytics" || id === "games"
                ? (id === "games" ? "Catalog operations are connected in Phase 8." : "Internal analytics are connected in Phase 3.")
                : (id === "users" || id === "access"
                    ? "Read-only users and access visibility is connected in Phase 4."
                    : (id === "realtime" || id === "system"
                        ? "Realtime monitoring and system health are connected in Phase 6."
                        : (id === "audit"
                            ? "Audit logs are connected in Phase 5."
                            : (id === "settings"
                                ? "Operations controls are connected in Phase 8."
                                : "This module will be connected in later phases."))))))
    }));

    const FEEDBACK_STATUSES = ["open", "reviewed", "fixed", "ignored", "moderation_review", "spam", "resolved"];
    const FEEDBACK_TYPES = ["feedback", "bug", "suggestion", "report"];
    const MODERATION_ACTIONS = ["", "feedback.mark_moderation", "feedback.mark_spam", "feedback.mark_resolved", "feedback.mark_ignored", "session.feedback_mute", "session.feedback_unmute", "user.note", "session.note", "room.close", "player.kick", "queue.remove"];
    const MODERATION_TARGET_TYPES = ["", "feedback", "user", "session", "room", "queue", "socket"];
    const ANALYTICS_EVENT_TYPES = ["page_view", "game_view", "game_play_start"];
    const USER_STATUSES = ["all", "free", "premium", "active", "expired"];
    const ENTITLEMENT_STATUSES = ["all", "active", "expired", "revoked"];
    const AUDIT_ACTIONS = ["", "entitlement.grant", "entitlement.revoke", "entitlement.extend", "entitlement.note_update", "feedback.status_update", "feedback.mark_moderation", "feedback.mark_spam", "feedback.mark_resolved", "feedback.mark_ignored", "session.feedback_mute", "session.feedback_unmute", "user.note", "session.note", "room.close", "player.kick", "queue.remove", "catalog.visibility_update", "catalog.labels_update", "catalog.priority_update", "catalog.note_update", "feature_flag.update", "operations.config_update"];
    const AUDIT_TARGET_TYPES = ["", "entitlement", "feedback", "user", "session", "room", "queue", "socket", "catalog_game", "feature_flag", "operations_config"];

    let activeModule = "overview";
    let adminEmail = "";
    let adminToken = "";
    let lastRefreshAt = "";
    const feedbackState = {
        filters: {
            status: "",
            type: "",
            gameSlug: "",
            search: ""
        },
        items: [],
        summary: null,
        nextCursor: null,
        loading: false,
        loaded: false,
        error: "",
        summaryError: false,
        detail: null,
        storageMode: ""
    };
    const moderationState = {
        overview: null,
        overviewLoading: false,
        overviewError: "",
        records: [],
        recordsNextCursor: null,
        recordsFilters: {
            targetType: "",
            action: "",
            status: "",
            search: ""
        },
        recordsLoading: false,
        recordsLoaded: false,
        recordsError: "",
        reports: [],
        reportsLoading: false,
        reportsLoaded: false,
        reportsError: "",
        detail: null,
        modal: null,
        pending: false,
        error: "",
        storageMode: ""
    };
    const analyticsState = {
        overview: null,
        overviewError: false,
        overviewLoading: false,
        events: [],
        eventsNextCursor: null,
        eventsFilters: {
            eventType: "",
            gameSlug: "",
            source: ""
        },
        eventsLoading: false,
        eventsLoaded: false,
        eventsError: "",
        storageMode: ""
    };
    const gamesState = {
        overview: null,
        overviewLoading: false,
        overviewError: "",
        filters: {
            search: "",
            catalog: "",
            category: "",
            visibility: "",
            featured: ""
        },
        items: [],
        loading: false,
        loaded: false,
        error: "",
        detail: null,
        detailLoading: false,
        detailError: "",
        modal: null,
        pending: false,
        actionError: "",
        storageMode: ""
    };
    const operationsState = {
        config: null,
        publicConfig: null,
        featureFlags: [],
        loading: false,
        loaded: false,
        error: "",
        modal: null,
        pending: false,
        actionError: "",
        storageMode: ""
    };
    const accountsState = {
        overview: null,
        overviewError: false,
        overviewLoading: false,
        users: [],
        usersNextCursor: null,
        usersFilters: {
            search: "",
            status: "all",
            plan: ""
        },
        usersLoading: false,
        usersLoaded: false,
        usersError: "",
        userDetail: null,
        userDetailLoading: false,
        userDetailError: "",
        entitlements: [],
        entitlementsNextCursor: null,
        entitlementsFilters: {
            search: "",
            status: "all",
            type: ""
        },
        entitlementsLoading: false,
        entitlementsLoaded: false,
        entitlementsError: "",
        ownedItems: [],
        ownedItemsNextCursor: null,
        ownedItemsLoading: false,
        ownedItemsLoaded: false,
        ownedItemsError: "",
        userAuditLogs: [],
        userAuditLoading: false,
        userAuditError: "",
        userModerationRecords: [],
        userModerationLoading: false,
        userModerationError: "",
        entitlementTypes: [],
        entitlementTypesLoaded: false,
        actionNotice: null,
        storageMode: "",
        dataConnected: true
    };
    const auditState = {
        filters: {
            action: "",
            targetType: "",
            adminEmail: "",
            targetEmail: ""
        },
        items: [],
        nextCursor: null,
        loading: false,
        loaded: false,
        error: "",
        detail: null,
        storageMode: ""
    };
    const realtimeState = {
        overview: null,
        overviewLoading: false,
        overviewError: "",
        rooms: [],
        roomsLoading: false,
        roomsLoaded: false,
        roomsError: "",
        queues: [],
        queuesLoading: false,
        queuesLoaded: false,
        queuesError: "",
        updatedAt: ""
    };
    const systemState = {
        health: null,
        healthLoading: false,
        healthError: "",
        logs: null,
        logsLoading: false,
        logsLoaded: false,
        logsError: ""
    };
    const entitlementActionState = {
        modal: null,
        pending: false,
        error: ""
    };
    let realtimePollTimer = 0;
    let systemHealthPollTimer = 0;

    document.addEventListener("DOMContentLoaded", () => {
        void init();
    });

    document.addEventListener("visibilitychange", () => {
        syncSystemPolling();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && (feedbackState.detail || moderationState.detail || moderationState.modal || gamesState.detail || gamesState.modal || operationsState.modal || accountsState.userDetail || auditState.detail || entitlementActionState.modal)) {
            feedbackState.detail = null;
            moderationState.detail = null;
            moderationState.modal = null;
            moderationState.error = "";
            gamesState.detail = null;
            gamesState.modal = null;
            gamesState.actionError = "";
            operationsState.modal = null;
            operationsState.actionError = "";
            accountsState.userDetail = null;
            auditState.detail = null;
            entitlementActionState.modal = null;
            entitlementActionState.error = "";
            renderActivePanel();
        }
    });

    function escapeHtml(value) {
        if (window.GameHubPremium?.escapeHtml) {
            return window.GameHubPremium.escapeHtml(value);
        }
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        }[character]));
    }

    function icon(name) {
        return window.GameHubPremium?.icon?.(name) || "";
    }

    function getUi() {
        return {
            gate: document.getElementById("admin-gate"),
            dashboard: document.getElementById("admin-dashboard"),
            nav: document.getElementById("admin-nav"),
            panel: document.getElementById("admin-panel"),
            email: document.getElementById("admin-current-email"),
            refresh: document.getElementById("admin-refresh"),
            refreshed: document.getElementById("admin-last-refreshed"),
            statusStrip: document.getElementById("admin-status-strip")
        };
    }

    function setGate(html) {
        const { gate, dashboard } = getUi();
        if (!gate || !dashboard) {
            return;
        }
        gate.hidden = false;
        dashboard.hidden = true;
        gate.innerHTML = html;
        window.GameHubPremium?.hydrateIcons?.(gate);
        window.GameHubPremium?.primeReveal?.(gate);
    }

    function renderLoading() {
        setGate(`
            <p class="premium-kicker">Admin</p>
            <h1>Checking admin access</h1>
            <p>Verifying your Premium GameHub session.</p>
            <div class="admin-loading-line" aria-hidden="true"></div>
        `);
    }

    function renderLoginRequired(reason = "") {
        setGate(`
            <p class="premium-kicker">Admin login required</p>
            <h1>Sign in to continue</h1>
            <p>${escapeHtml(reason || "Use the existing Premium GameHub login to request admin access.")}</p>
            <div class="admin-gate-actions">
                <a class="premium-primary-button" href="/premium/login?next=%2Fadmin">
                    ${icon("lock")}
                    <span>Open premium login</span>
                </a>
                <a class="premium-ghost-button" href="/gamehub">
                    ${icon("grid")}
                    <span>Back to GameHub</span>
                </a>
            </div>
        `);
    }

    function renderAccessDenied(email) {
        setGate(`
            <p class="premium-kicker">Access denied</p>
            <h1>This account is not an admin</h1>
            <p>Signed in as <strong>${escapeHtml(email || "unknown account")}</strong>.</p>
            <div class="admin-gate-actions">
                <a class="premium-primary-button" href="/premium/login?next=%2Fadmin">
                    ${icon("user")}
                    <span>Switch account</span>
                </a>
                <a class="premium-ghost-button" href="/gamehub">
                    ${icon("grid")}
                    <span>Back to GameHub</span>
                </a>
            </div>
        `);
    }

    function moduleStatusLabel(label, ready, error) {
        if (error) {
            return { label: `${label} degraded`, state: "error" };
        }
        if (ready) {
            return { label: `${label} live`, state: "ok" };
        }
        return { label: `${label} loading`, state: "loading" };
    }

    function updateAdminHeader() {
        const { statusStrip, refreshed } = getUi();
        if (statusStrip) {
            const chips = [
                moduleStatusLabel("Analytics", Boolean(analyticsState.overview), analyticsState.overviewError),
                moduleStatusLabel("Feedback", Boolean(feedbackState.summary), feedbackState.summaryError),
                moduleStatusLabel("Realtime", Boolean(realtimeState.overview), Boolean(realtimeState.overviewError)),
                { label: "Secure admin", state: "ok" }
            ];
            statusStrip.innerHTML = chips.map((chip) => `<span class="admin-status-chip is-${escapeHtml(chip.state)}">${escapeHtml(chip.label)}</span>`).join("");
        }
        if (refreshed) {
            refreshed.textContent = lastRefreshAt ? `Last refreshed ${formatDate(lastRefreshAt)}` : "Waiting for data";
        }
    }

    async function refreshCurrentModule() {
        lastRefreshAt = new Date().toISOString();
        updateAdminHeader();
        if (activeModule === "overview") {
            await Promise.all([
                loadFeedbackSummary(),
                loadModerationOverview({ silent: true }),
                loadAnalyticsOverview({ silent: true }),
                loadAccountsOverview({ silent: true }),
                loadRealtimeOverview({ silent: true }),
                loadSystemHealth({ silent: true })
            ]);
            return;
        }
        if (activeModule === "analytics") {
            await Promise.all([loadAnalyticsOverview(), loadAnalyticsEvents({ silent: true })]);
            return;
        }
        if (activeModule === "games") {
            await Promise.all([loadCatalogOverview(), loadCatalogGames()]);
            return;
        }
        if (activeModule === "feedback") {
            await Promise.all([loadFeedbackSummary(), loadFeedback()]);
            return;
        }
        if (activeModule === "moderation") {
            await Promise.all([loadModerationOverview(), loadModerationReports(), loadModerationRecords({ silent: true })]);
            return;
        }
        if (activeModule === "users") {
            await Promise.all([loadAccountsOverview({ silent: true }), loadUsers()]);
            return;
        }
        if (activeModule === "access") {
            await Promise.all([loadAccountsOverview({ silent: true }), loadEntitlements({ silent: true }), loadOwnedItems({ silent: true })]);
            return;
        }
        if (activeModule === "realtime") {
            await refreshRealtimeMonitoring();
            return;
        }
        if (activeModule === "system") {
            await Promise.all([loadSystemHealth(), loadSystemLogs()]);
            return;
        }
        if (activeModule === "audit") {
            await loadAuditLogs();
            return;
        }
        if (activeModule === "settings") {
            await Promise.all([loadOperationsConfig(), loadFeatureFlags()]);
        }
    }

    function renderDashboard(email, token) {
        const { gate, dashboard, nav } = getUi();
        if (!gate || !dashboard || !nav) {
            return;
        }
        adminEmail = email || "Admin";
        adminToken = token || adminToken;
        gate.hidden = true;
        dashboard.hidden = false;
        const emailNode = getUi().email;
        if (emailNode) {
            emailNode.textContent = adminEmail;
        }
        nav.innerHTML = MODULES.map((module) => `
            <button class="admin-nav-button${module.id === activeModule ? " is-active" : ""}" type="button" data-admin-module="${module.id}" aria-selected="${module.id === activeModule ? "true" : "false"}">
                ${icon(module.iconName || "grid")}
                <span>${escapeHtml(module.label)}</span>
            </button>
        `).join("");
        nav.querySelectorAll("[data-admin-module]").forEach((button) => {
            button.addEventListener("click", () => {
                activeModule = button.dataset.adminModule || "overview";
                renderDashboard(adminEmail, adminToken);
                getUi().panel?.focus?.();
            });
        });
        const refreshButton = getUi().refresh;
        if (refreshButton) {
            refreshButton.onclick = () => {
                void refreshCurrentModule();
            };
        }
        updateAdminHeader();
        renderActivePanel();
        window.GameHubPremium?.hydrateIcons?.(dashboard);
        window.GameHubPremium?.primeReveal?.(dashboard);
    }

    function renderActivePanel() {
        syncSystemPolling();
        updateAdminHeader();
        const { panel } = getUi();
        const module = MODULES.find((entry) => entry.id === activeModule) || MODULES[0];
        if (!panel) {
            return;
        }

        if (activeModule === "feedback") {
            renderFeedbackPanel(panel, module);
            return;
        }

        if (activeModule === "moderation") {
            renderModerationPanel(panel, module);
            return;
        }

        if (activeModule === "analytics") {
            renderAnalyticsPanel(panel, module);
            return;
        }

        if (activeModule === "games") {
            renderGamesPanel(panel, module);
            return;
        }

        if (activeModule === "users") {
            renderUsersPanel(panel, module);
            return;
        }

        if (activeModule === "access") {
            renderAccessPanel(panel, module);
            return;
        }

        if (activeModule === "realtime") {
            renderRealtimePanel(panel, module);
            return;
        }

        if (activeModule === "system") {
            renderSystemPanel(panel, module);
            return;
        }

        if (activeModule === "audit") {
            renderAuditPanel(panel, module);
            return;
        }

        if (activeModule === "settings") {
            renderOperationsPanel(panel, module);
            return;
        }

        const overviewMarkup = activeModule === "overview" ? renderOverviewCards() : "";
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>${escapeHtml(module.description)}</p>
            </div>
            <article class="admin-placeholder-card">
                <strong>${escapeHtml(module.phase)}</strong>
                <p>${activeModule === "overview" ? "Analytics, feedback, catalog operations, users, realtime, and system cards are connected." : "No live data is connected in this phase."}</p>
            </article>
            ${overviewMarkup}
        `;
    }

    function renderOverviewCards() {
        const summary = feedbackState.summary;
        const feedbackPending = feedbackState.summaryError ? "Unavailable" : "Loading...";
        const analytics = analyticsState.overview;
        const analyticsPending = analyticsState.overviewError ? "Unavailable" : "Loading...";
        const accounts = accountsState.overview;
        const accountsPending = accountsState.overviewError ? "Unavailable" : "Loading...";
        const realtime = realtimeState.overview;
        const realtimePending = realtimeState.overviewError ? "Unavailable" : "Loading...";
        const moderation = moderationState.overview;
        const moderationPending = moderationState.overviewError ? "Unavailable" : "Loading...";
        const catalog = gamesState.overview;
        const catalogPending = gamesState.overviewError ? "Unavailable" : "Loading...";
        const health = systemState.health;
        const healthPending = systemState.healthError ? "Unavailable" : "Loading...";
        const feedbackTotal = summary && !feedbackState.summaryError ? String(summary.total || 0) : feedbackPending;
        const openBugs = summary && !feedbackState.summaryError ? String(summary.openBugs || 0) : feedbackPending;
        const totals = analytics?.totals || {};
        const accountTotals = accounts?.totals || {};
        const realtimeTotals = realtime?.totals || {};
        const moderationTotals = moderation?.totals || {};
        const topGame = totals.topGameByPlays || totals.topGameByViews || null;
        const cards = [
            ["Total Views", analytics ? formatNumber(totals.totalViews) : analyticsPending, "Public page views"],
            ["Today's Views", analytics ? formatNumber(totals.todayViews) : analyticsPending, "Public views today"],
            ["Game Plays", analytics ? formatNumber(totals.totalGamePlays) : analyticsPending, "Started game sessions"],
            ["Today's Game Plays", analytics ? formatNumber(totals.todayGamePlays) : analyticsPending, "Starts today"],
            ["Top Game", analytics ? (topGame?.gameTitle || topGame?.gameSlug || "Not enough data") : analyticsPending, "By play starts"],
            ["Top Traffic Source", analytics ? titleCase(totals.topSource || "direct") : analyticsPending, "Public page traffic"],
            ["Feedback", feedbackTotal, "Connected in feedback phase"],
            ["Open bug reports", openBugs, "Connected in feedback phase"],
            ["Catalog Games", catalog ? formatNumber(catalog.totals?.totalGames) : catalogPending, "Public and premium entries"],
            ["Maintenance Games", catalog ? formatNumber(catalog.totals?.maintenanceGames) : catalogPending, "Launch-blocked releases"],
            ["Featured Games", catalog ? formatNumber(catalog.totals?.featuredGames) : catalogPending, "Manual highlights"],
            ["Active Restrictions", moderation ? formatNumber(moderationTotals.activeRestrictions) : moderationPending, "Temporary moderation limits"],
            ["Rooms Closed Today", moderation ? formatNumber(moderationTotals.roomsClosedToday) : moderationPending, "Admin room controls"],
            ["Users", accounts ? formatMetricValue(accountTotals.totalUsers) : accountsPending, "Read-only account visibility"],
            ["Premium Users", accounts ? formatMetricValue(accountTotals.premiumUsers) : accountsPending, "Active premium access"],
            ["Active Entitlements", accounts ? formatMetricValue(accountTotals.activeEntitlements) : accountsPending, "Read-only access records"],
            ["Expired Entitlements", accounts ? formatMetricValue(accountTotals.expiredEntitlements) : accountsPending, "Expired access records"],
            ["Active Rooms", realtime ? formatNumber(realtimeTotals.activeRooms) : realtimePending, "Live realtime rooms"],
            ["Online Sockets", realtime ? formatNumber(realtimeTotals.activeSockets) : realtimePending, "Socket.IO connections"],
            ["System Health", health ? titleCase(health.status || "unknown") : healthPending, "Server health checks"]
        ];

        return `<div class="admin-card-grid">${cards.map(([title, value, copy]) => `
            <article class="admin-stat-card">
                <span>${escapeHtml(title)}</span>
                <strong>${escapeHtml(value)}</strong>
                <p>${escapeHtml(copy)}</p>
            </article>
        `).join("")}</div>`;
    }

    async function adminFetch(path, options = {}) {
        if (!adminToken && window.GameHubAdminAccess?.checkAdmin) {
            const result = await window.GameHubAdminAccess.checkAdmin();
            if (result.state === "admin") {
                adminToken = result.token || "";
                adminEmail = result.email || adminEmail;
            }
        }

        const response = await fetch(path, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
                ...(options.headers || {})
            },
            cache: "no-store"
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload?.ok === false) {
            throw new Error(payload?.error || `Admin request failed with status ${response.status}`);
        }
        return payload;
    }

    function buildFeedbackQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...feedbackState.filters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadFeedback(options = {}) {
        feedbackState.loading = true;
        feedbackState.error = "";
        if (!options.silent) {
            renderActivePanel();
        }

        try {
            const query = buildFeedbackQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/feedback?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            feedbackState.items = options.append ? [...feedbackState.items, ...items] : items;
            feedbackState.nextCursor = payload.nextCursor || null;
            feedbackState.summary = payload.summary || feedbackState.summary;
            feedbackState.summaryError = false;
            feedbackState.storageMode = payload.storageMode || "";
            feedbackState.loaded = true;
        } catch (error) {
            feedbackState.error = error?.message || "Could not load feedback.";
        } finally {
            feedbackState.loading = false;
            if (activeModule === "feedback" || activeModule === "overview") {
                renderActivePanel();
            }
        }
    }

    async function loadFeedbackSummary() {
        try {
            const payload = await adminFetch("/api/admin/feedback?limit=1");
            feedbackState.summary = payload.summary || feedbackState.summary;
            feedbackState.summaryError = false;
            feedbackState.storageMode = payload.storageMode || "";
            if (activeModule === "overview") {
                renderActivePanel();
            }
        } catch (_) {
            feedbackState.summaryError = true;
        }
    }

    async function loadModerationOverview(options = {}) {
        moderationState.overviewLoading = true;
        moderationState.overviewError = "";
        if (!options.silent && activeModule === "moderation") {
            renderActivePanel();
        }
        try {
            const payload = await adminFetch("/api/admin/moderation/overview");
            moderationState.overview = {
                totals: payload.totals || {},
                recentActions: Array.isArray(payload.recentActions) ? payload.recentActions : []
            };
            moderationState.storageMode = payload.storageMode || "";
        } catch (error) {
            moderationState.overviewError = error?.message || "Could not load moderation overview.";
        } finally {
            moderationState.overviewLoading = false;
            if (activeModule === "moderation" || activeModule === "overview") {
                renderActivePanel();
            }
        }
    }

    function buildModerationRecordsQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...moderationState.recordsFilters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadModerationRecords(options = {}) {
        moderationState.recordsLoading = true;
        moderationState.recordsError = "";
        if (!options.silent && activeModule === "moderation") {
            renderActivePanel();
        }
        try {
            const query = buildModerationRecordsQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/moderation/records?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            moderationState.records = options.append ? [...moderationState.records, ...items] : items;
            moderationState.recordsNextCursor = payload.nextCursor || null;
            moderationState.recordsLoaded = true;
            moderationState.storageMode = payload.storageMode || moderationState.storageMode;
        } catch (error) {
            moderationState.recordsError = error?.message || "Could not load moderation records.";
        } finally {
            moderationState.recordsLoading = false;
            if (activeModule === "moderation") {
                renderActivePanel();
            }
        }
    }

    async function loadModerationReports(options = {}) {
        moderationState.reportsLoading = true;
        moderationState.reportsError = "";
        if (!options.silent && activeModule === "moderation") {
            renderActivePanel();
        }
        try {
            const queries = [
                "/api/admin/feedback?type=report&limit=50",
                "/api/admin/feedback?status=moderation_review&limit=50",
                "/api/admin/feedback?status=spam&limit=50"
            ];
            const payloads = await Promise.all(queries.map((query) => adminFetch(query)));
            const map = new Map();
            payloads.forEach((payload) => {
                (Array.isArray(payload.items) ? payload.items : []).forEach((item) => {
                    map.set(item.id, item);
                });
            });
            moderationState.reports = [...map.values()].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
            moderationState.reportsLoaded = true;
        } catch (error) {
            moderationState.reportsError = error?.message || "Could not load moderation reports.";
        } finally {
            moderationState.reportsLoading = false;
            if (activeModule === "moderation") {
                renderActivePanel();
            }
        }
    }

    function buildAuditQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...auditState.filters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadAuditLogs(options = {}) {
        auditState.loading = true;
        auditState.error = "";
        if (!options.silent && isAuditView()) {
            renderActivePanel();
        }

        try {
            const query = buildAuditQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/audit-logs?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            auditState.items = options.append ? [...auditState.items, ...items] : items;
            auditState.nextCursor = payload.nextCursor || null;
            auditState.storageMode = payload.storageMode || "";
            auditState.loaded = true;
        } catch (error) {
            auditState.error = error?.message || "Could not load audit logs.";
        } finally {
            auditState.loading = false;
            if (isAuditView()) {
                renderActivePanel();
            }
        }
    }

    function isRealtimeView() {
        return activeModule === "realtime";
    }

    function isSystemView() {
        return activeModule === "system";
    }

    function isAuditView() {
        return activeModule === "audit" || activeModule === "system";
    }

    function syncSystemPolling() {
        const shouldPoll = (isRealtimeView() || isSystemView()) && !document.hidden;
        if (!shouldPoll) {
            stopSystemPolling();
            return;
        }
        if (isRealtimeView() && !realtimePollTimer) {
            realtimePollTimer = window.setInterval(() => {
                if (isRealtimeView()) {
                    void refreshRealtimeMonitoring({ silent: true });
                }
            }, 15000);
        } else if (!isRealtimeView() && realtimePollTimer) {
            window.clearInterval(realtimePollTimer);
            realtimePollTimer = 0;
        }
        if (isSystemView() && !systemHealthPollTimer) {
            systemHealthPollTimer = window.setInterval(() => {
                if (isSystemView()) {
                    void loadSystemHealth({ silent: true });
                }
            }, 30000);
        } else if (!isSystemView() && systemHealthPollTimer) {
            window.clearInterval(systemHealthPollTimer);
            systemHealthPollTimer = 0;
        }
    }

    function stopSystemPolling() {
        if (realtimePollTimer) {
            window.clearInterval(realtimePollTimer);
            realtimePollTimer = 0;
        }
        if (systemHealthPollTimer) {
            window.clearInterval(systemHealthPollTimer);
            systemHealthPollTimer = 0;
        }
    }

    async function refreshRealtimeMonitoring(options = {}) {
        await Promise.all([
            loadRealtimeOverview(options),
            loadRealtimeRooms(options),
            loadRealtimeQueues(options)
        ]);
    }

    async function loadRealtimeOverview(options = {}) {
        realtimeState.overviewLoading = true;
        realtimeState.overviewError = "";
        if (!options.silent && isRealtimeView()) {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/realtime/overview");
            realtimeState.overview = {
                totals: payload.totals || {},
                byGame: Array.isArray(payload.byGame) ? payload.byGame : [],
                updatedAt: payload.updatedAt || ""
            };
            realtimeState.updatedAt = payload.updatedAt || realtimeState.updatedAt;
        } catch (error) {
            realtimeState.overviewError = error?.message || "Could not load realtime overview.";
        } finally {
            realtimeState.overviewLoading = false;
            if (activeModule === "overview" || isRealtimeView()) {
                renderActivePanel();
            }
        }
    }

    async function loadRealtimeRooms(options = {}) {
        realtimeState.roomsLoading = true;
        realtimeState.roomsError = "";
        if (!options.silent && isRealtimeView()) {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/realtime/rooms?limit=50");
            realtimeState.rooms = Array.isArray(payload.items) ? payload.items : [];
            realtimeState.roomsLoaded = true;
            realtimeState.updatedAt = payload.updatedAt || realtimeState.updatedAt;
        } catch (error) {
            realtimeState.roomsError = error?.message || "Could not load realtime rooms.";
        } finally {
            realtimeState.roomsLoading = false;
            if (isRealtimeView()) {
                renderActivePanel();
            }
        }
    }

    async function loadRealtimeQueues(options = {}) {
        realtimeState.queuesLoading = true;
        realtimeState.queuesError = "";
        if (!options.silent && isRealtimeView()) {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/realtime/queues");
            realtimeState.queues = Array.isArray(payload.queues) ? payload.queues : [];
            realtimeState.queuesLoaded = true;
            realtimeState.updatedAt = payload.updatedAt || realtimeState.updatedAt;
        } catch (error) {
            realtimeState.queuesError = error?.message || "Could not load matchmaking queues.";
        } finally {
            realtimeState.queuesLoading = false;
            if (isRealtimeView()) {
                renderActivePanel();
            }
        }
    }

    async function loadSystemHealth(options = {}) {
        systemState.healthLoading = true;
        systemState.healthError = "";
        if (!options.silent && isSystemView()) {
            renderActivePanel();
        }

        try {
            systemState.health = await adminFetch("/api/admin/system/health");
        } catch (error) {
            systemState.healthError = error?.message || "Could not load system health.";
        } finally {
            systemState.healthLoading = false;
            if (activeModule === "overview" || isSystemView()) {
                renderActivePanel();
            }
        }
    }

    async function loadSystemLogs(options = {}) {
        systemState.logsLoading = true;
        systemState.logsError = "";
        if (!options.silent && isSystemView()) {
            renderActivePanel();
        }

        try {
            systemState.logs = await adminFetch("/api/admin/system/logs");
            systemState.logsLoaded = true;
        } catch (error) {
            systemState.logsError = error?.message || "Could not load system logs.";
        } finally {
            systemState.logsLoading = false;
            if (isSystemView()) {
                renderActivePanel();
            }
        }
    }

    async function loadAnalyticsOverview(options = {}) {
        analyticsState.overviewLoading = true;
        if (!options.silent && activeModule === "analytics") {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/analytics/overview");
            analyticsState.overview = {
                totals: payload.totals || {},
                daily: Array.isArray(payload.daily) ? payload.daily : [],
                bySource: Array.isArray(payload.bySource) ? payload.bySource : [],
                byDevice: Array.isArray(payload.byDevice) ? payload.byDevice : []
            };
            analyticsState.storageMode = payload.storageMode || "";
            analyticsState.overviewError = false;
        } catch (_) {
            analyticsState.overviewError = true;
        } finally {
            analyticsState.overviewLoading = false;
            if (activeModule === "overview" || activeModule === "analytics") {
                renderActivePanel();
            }
        }
    }

    function buildAnalyticsEventsQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...analyticsState.eventsFilters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadAnalyticsEvents(options = {}) {
        analyticsState.eventsLoading = true;
        analyticsState.eventsError = "";
        if (!options.silent && activeModule === "analytics") {
            renderActivePanel();
        }

        try {
            const query = buildAnalyticsEventsQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/analytics/events?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            analyticsState.events = options.append ? [...analyticsState.events, ...items] : items;
            analyticsState.eventsNextCursor = payload.nextCursor || null;
            analyticsState.storageMode = payload.storageMode || analyticsState.storageMode;
            analyticsState.eventsLoaded = true;
        } catch (error) {
            analyticsState.eventsError = error?.message || "Could not load analytics events.";
        } finally {
            analyticsState.eventsLoading = false;
            if (activeModule === "analytics") {
                renderActivePanel();
            }
        }
    }

    async function loadCatalogOverview(options = {}) {
        gamesState.overviewLoading = true;
        gamesState.overviewError = "";
        if (!options.silent && (activeModule === "games" || activeModule === "overview")) {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/catalog/overview");
            gamesState.overview = {
                totals: payload.totals || {},
                topGames: Array.isArray(payload.topGames) ? payload.topGames : [],
                recentlyChanged: Array.isArray(payload.recentlyChanged) ? payload.recentlyChanged : []
            };
            gamesState.storageMode = payload.storageMode || gamesState.storageMode;
        } catch (error) {
            gamesState.overviewError = error?.message || "Could not load catalog overview.";
        } finally {
            gamesState.overviewLoading = false;
            if (activeModule === "games" || activeModule === "overview") {
                renderActivePanel();
            }
        }
    }

    function buildCatalogGamesQuery() {
        const params = new URLSearchParams();
        Object.entries(gamesState.filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized) {
                params.set(key, normalized);
            }
        });
        params.set("limit", "300");
        return params.toString();
    }

    async function loadCatalogGames(options = {}) {
        gamesState.loading = true;
        gamesState.error = "";
        if (!options.silent && activeModule === "games") {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch(`/api/admin/catalog/games?${buildCatalogGamesQuery()}`);
            gamesState.items = Array.isArray(payload.items) ? payload.items : [];
            gamesState.storageMode = payload.storageMode || gamesState.storageMode;
            gamesState.loaded = true;
        } catch (error) {
            gamesState.error = error?.message || "Could not load catalog games.";
        } finally {
            gamesState.loading = false;
            if (activeModule === "games") {
                renderActivePanel();
            }
        }
    }

    async function loadCatalogDetail(slug, catalog) {
        gamesState.detailLoading = true;
        gamesState.detailError = "";
        renderActivePanel();
        try {
            const query = catalog ? `?catalog=${encodeURIComponent(catalog)}` : "";
            const payload = await adminFetch(`/api/admin/catalog/games/${encodeURIComponent(slug)}${query}`);
            gamesState.detail = payload.game || null;
        } catch (error) {
            gamesState.detailError = error?.message || "Could not load catalog detail.";
        } finally {
            gamesState.detailLoading = false;
            renderActivePanel();
        }
    }

    async function loadFeatureFlags(options = {}) {
        operationsState.loading = true;
        operationsState.error = "";
        if (!options.silent && activeModule === "settings") {
            renderActivePanel();
        }
        try {
            const payload = await adminFetch("/api/admin/feature-flags");
            operationsState.featureFlags = Array.isArray(payload.items) ? payload.items : [];
            operationsState.storageMode = payload.storageMode || operationsState.storageMode;
            operationsState.loaded = true;
        } catch (error) {
            operationsState.error = error?.message || "Could not load feature flags.";
        } finally {
            operationsState.loading = false;
            if (activeModule === "settings") {
                renderActivePanel();
            }
        }
    }

    async function loadOperationsConfig(options = {}) {
        operationsState.loading = true;
        operationsState.error = "";
        if (!options.silent && activeModule === "settings") {
            renderActivePanel();
        }
        try {
            const payload = await adminFetch("/api/admin/operations/config");
            operationsState.config = payload.config || null;
            operationsState.publicConfig = payload.publicConfig || null;
            operationsState.storageMode = payload.storageMode || operationsState.storageMode;
            operationsState.loaded = true;
        } catch (error) {
            operationsState.error = error?.message || "Could not load operations config.";
        } finally {
            operationsState.loading = false;
            if (activeModule === "settings") {
                renderActivePanel();
            }
        }
    }

    async function loadAccountsOverview(options = {}) {
        accountsState.overviewLoading = true;
        if (!options.silent && activeModule === "overview") {
            renderActivePanel();
        }

        try {
            const payload = await adminFetch("/api/admin/users/overview");
            accountsState.overview = {
                totals: payload.totals || {},
                dataConnected: payload.dataConnected !== false
            };
            accountsState.dataConnected = payload.dataConnected !== false;
            accountsState.storageMode = payload.storageMode || "";
            accountsState.overviewError = false;
        } catch (_) {
            accountsState.overviewError = true;
        } finally {
            accountsState.overviewLoading = false;
            if (activeModule === "overview" || activeModule === "users" || activeModule === "access") {
                renderActivePanel();
            }
        }
    }

    function buildUsersQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...accountsState.usersFilters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized && !(key === "status" && normalized === "all")) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadUsers(options = {}) {
        accountsState.usersLoading = true;
        accountsState.usersError = "";
        if (!options.silent && activeModule === "users") {
            renderActivePanel();
        }

        try {
            const query = buildUsersQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/users?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            accountsState.users = options.append ? [...accountsState.users, ...items] : items;
            accountsState.usersNextCursor = payload.nextCursor || null;
            accountsState.dataConnected = payload.dataConnected !== false;
            accountsState.storageMode = payload.storageMode || accountsState.storageMode;
            accountsState.usersLoaded = true;
        } catch (error) {
            accountsState.usersError = error?.message || "Could not load users.";
        } finally {
            accountsState.usersLoading = false;
            if (activeModule === "users") {
                renderActivePanel();
            }
        }
    }

    async function loadUserDetail(id) {
        accountsState.userDetailLoading = true;
        accountsState.userDetailError = "";
        accountsState.userAuditLogs = [];
        accountsState.userAuditError = "";
        accountsState.userModerationRecords = [];
        accountsState.userModerationError = "";
        renderActivePanel();

        try {
            const payload = await adminFetch(`/api/admin/users/${encodeURIComponent(id)}`);
            accountsState.userDetail = payload.user || null;
            accountsState.userDetailError = payload.user ? "" : "No user detail record was found.";
            if (payload.user) {
                await Promise.all([
                    loadUserAuditHistory(payload.user),
                    loadUserModerationHistory(payload.user)
                ]);
            }
        } catch (error) {
            accountsState.userDetail = null;
            accountsState.userDetailError = error?.message || "Could not load user detail.";
        } finally {
            accountsState.userDetailLoading = false;
            if (activeModule === "users") {
                renderActivePanel();
            }
        }
    }

    async function loadUserAuditHistory(user) {
        accountsState.userAuditLoading = true;
        accountsState.userAuditError = "";
        try {
            const params = new URLSearchParams({ limit: "20" });
            if (user?.email && user.email !== "Unknown") {
                params.set("targetEmail", user.email);
            } else if (user?.id) {
                params.set("targetEmail", user.id);
            }
            const payload = await adminFetch(`/api/admin/audit-logs?${params}`);
            accountsState.userAuditLogs = Array.isArray(payload.items) ? payload.items : [];
        } catch (error) {
            accountsState.userAuditLogs = [];
            accountsState.userAuditError = error?.message || "Could not load action history.";
        } finally {
            accountsState.userAuditLoading = false;
        }
    }

    async function loadUserModerationHistory(user) {
        accountsState.userModerationLoading = true;
        accountsState.userModerationError = "";
        try {
            const params = new URLSearchParams({ limit: "20" });
            if (user?.email && user.email !== "Unknown") {
                params.set("search", user.email);
            } else if (user?.id) {
                params.set("search", user.id);
            }
            const payload = await adminFetch(`/api/admin/moderation/records?${params}`);
            accountsState.userModerationRecords = Array.isArray(payload.items) ? payload.items : [];
        } catch (error) {
            accountsState.userModerationRecords = [];
            accountsState.userModerationError = error?.message || "Could not load moderation history.";
        } finally {
            accountsState.userModerationLoading = false;
        }
    }

    async function loadEntitlementTypes() {
        if (accountsState.entitlementTypesLoaded) {
            return;
        }
        try {
            const payload = await adminFetch("/api/admin/entitlements/types");
            accountsState.entitlementTypes = Array.isArray(payload.items) ? payload.items : [];
            accountsState.entitlementTypesLoaded = true;
        } catch (_) {
            accountsState.entitlementTypes = [];
            accountsState.entitlementTypesLoaded = true;
        }
    }

    function buildEntitlementsQuery(extra = {}) {
        const params = new URLSearchParams();
        const filters = {
            ...accountsState.entitlementsFilters,
            ...extra
        };
        Object.entries(filters).forEach(([key, value]) => {
            const normalized = String(value || "").trim();
            if (normalized && !(key === "status" && normalized === "all")) {
                params.set(key, normalized);
            }
        });
        if (!params.has("limit")) {
            params.set("limit", "50");
        }
        return params.toString();
    }

    async function loadEntitlements(options = {}) {
        accountsState.entitlementsLoading = true;
        accountsState.entitlementsError = "";
        if (!options.silent && activeModule === "access") {
            renderActivePanel();
        }

        try {
            const query = buildEntitlementsQuery(options.cursor ? { cursor: options.cursor } : {});
            const payload = await adminFetch(`/api/admin/entitlements?${query}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            accountsState.entitlements = options.append ? [...accountsState.entitlements, ...items] : items;
            accountsState.entitlementsNextCursor = payload.nextCursor || null;
            accountsState.dataConnected = payload.dataConnected !== false;
            accountsState.storageMode = payload.storageMode || accountsState.storageMode;
            accountsState.entitlementsLoaded = true;
        } catch (error) {
            accountsState.entitlementsError = error?.message || "Could not load entitlements.";
        } finally {
            accountsState.entitlementsLoading = false;
            if (activeModule === "access") {
                renderActivePanel();
            }
        }
    }

    async function loadOwnedItems(options = {}) {
        accountsState.ownedItemsLoading = true;
        accountsState.ownedItemsError = "";
        if (!options.silent && activeModule === "access") {
            renderActivePanel();
        }

        try {
            const params = new URLSearchParams({ limit: "50" });
            if (options.cursor) {
                params.set("cursor", options.cursor);
            }
            const payload = await adminFetch(`/api/admin/owned-items?${params}`);
            const items = Array.isArray(payload.items) ? payload.items : [];
            accountsState.ownedItems = options.append ? [...accountsState.ownedItems, ...items] : items;
            accountsState.ownedItemsNextCursor = payload.nextCursor || null;
            accountsState.dataConnected = payload.dataConnected !== false;
            accountsState.storageMode = payload.storageMode || accountsState.storageMode;
            accountsState.ownedItemsLoaded = true;
        } catch (error) {
            accountsState.ownedItemsError = error?.message || "Could not load owned items.";
        } finally {
            accountsState.ownedItemsLoading = false;
            if (activeModule === "access") {
                renderActivePanel();
            }
        }
    }

    function formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "Unknown";
        }
        return date.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatNumber(value) {
        return new Intl.NumberFormat().format(Number(value) || 0);
    }

    function formatDuration(seconds) {
        const total = Math.max(0, Math.round(Number(seconds) || 0));
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const remainingSeconds = total % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    function formatBytes(value) {
        const bytes = Number(value) || 0;
        if (bytes >= 1024 * 1024 * 1024) {
            return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
        }
        if (bytes >= 1024 * 1024) {
            return `${Math.round(bytes / 1024 / 1024)} MB`;
        }
        if (bytes >= 1024) {
            return `${Math.round(bytes / 1024)} KB`;
        }
        return `${Math.round(bytes)} B`;
    }

    function formatMetricValue(value) {
        return value === null || value === undefined ? "Not available yet" : formatNumber(value);
    }

    function titleCase(value) {
        return String(value || "")
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function shortText(value, length = 120) {
        const text = String(value || "").replace(/\s+/g, " ").trim();
        return text.length > length ? `${text.slice(0, length - 1)}...` : text;
    }

    function shortSession(value) {
        const text = String(value || "").trim();
        if (!text) {
            return "Anonymous";
        }
        return text.length > 18 ? `${text.slice(0, 10)}...${text.slice(-4)}` : text;
    }

    function shortId(value) {
        const text = String(value || "").trim();
        if (!text) {
            return "None";
        }
        return text.length > 20 ? `${text.slice(0, 10)}...${text.slice(-6)}` : text;
    }

    function percentOf(value, total) {
        const safeTotal = Number(total) || 0;
        if (!safeTotal) {
            return 0;
        }
        return Math.max(0, Math.min(100, Math.round((Number(value) || 0) / safeTotal * 100)));
    }

    function renderAnalyticsPanel(panel, module) {
        const overview = analyticsState.overview;
        const totals = overview?.totals || {};
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>${escapeHtml(module.description)}</p>
            </div>
            <div class="admin-feedback-summary admin-analytics-summary">
                ${renderFeedbackSummaryCard("Total views", overview ? formatNumber(totals.totalViews) : analyticsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Today views", overview ? formatNumber(totals.todayViews) : analyticsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Game plays", overview ? formatNumber(totals.totalGamePlays) : analyticsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Today plays", overview ? formatNumber(totals.todayGamePlays) : analyticsState.overviewError ? "Unavailable" : "Loading...")}
            </div>
            ${renderAnalyticsBreakdowns()}
            ${renderAnalyticsDaily()}
            ${renderAnalyticsEventsSection()}
        `;

        bindAnalyticsPanel(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!analyticsState.overview && !analyticsState.overviewLoading && !analyticsState.overviewError) {
            void loadAnalyticsOverview({ silent: true });
        }
        if (!analyticsState.eventsLoaded && !analyticsState.eventsLoading) {
            void loadAnalyticsEvents({ silent: true });
        }
        if (!gamesState.loaded && !gamesState.loading) {
            void loadCatalogGames({ silent: true });
        }
    }

    function renderAnalyticsBreakdowns() {
        const overview = analyticsState.overview;
        if (analyticsState.overviewLoading && !overview) {
            return `<article class="admin-placeholder-card"><strong>Loading analytics...</strong><p>Fetching aggregate analytics from the server.</p></article>`;
        }
        if (analyticsState.overviewError && !overview) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load analytics</strong><p>Analytics storage is not available yet.</p></article>`;
        }

        const sources = overview?.bySource || [];
        const devices = overview?.byDevice || [];
        const sourceTotal = sources.reduce((total, source) => total + Number(source.totalViews || 0), 0);
        const deviceTotal = devices.reduce((total, device) => total + Number(device.count || 0), 0);
        const topGames = gamesState.items.slice(0, 5);

        return `
            <div class="admin-analytics-grid">
                <article class="admin-analytics-card">
                    <h3>Traffic Sources</h3>
                    ${sources.length ? sources.slice(0, 8).map((source) => renderMetricBar(titleCase(source.source), source.totalViews || 0, sourceTotal)).join("") : "<p>No source data yet.</p>"}
                </article>
                <article class="admin-analytics-card">
                    <h3>Devices</h3>
                    ${devices.length ? devices.map((device) => renderMetricBar(titleCase(device.deviceType), device.count || 0, deviceTotal)).join("") : "<p>No device data yet.</p>"}
                </article>
                <article class="admin-analytics-card">
                    <h3>Top Games</h3>
                    ${topGames.length ? topGames.map((game) => {
                        const stats = game.analyticsSummary || game;
                        return renderMetricBar(game.title || stats.gameTitle || stats.gameSlug, stats.totalPlays || stats.totalViews || 0, Math.max(...topGames.map((entry) => Number(entry.analyticsSummary?.totalPlays || entry.analyticsSummary?.totalViews || entry.totalPlays || entry.totalViews || 0)), 1));
                    }).join("") : "<p>No game activity yet.</p>"}
                </article>
            </div>
        `;
    }

    function renderMetricBar(label, value, total) {
        const pct = percentOf(value, total);
        return `
            <div class="admin-metric-bar">
                <div>
                    <span>${escapeHtml(label || "Unknown")}</span>
                    <strong>${escapeHtml(formatNumber(value))}</strong>
                </div>
                <i style="--admin-metric:${pct}%"></i>
            </div>
        `;
    }

    function renderAnalyticsDaily() {
        const daily = analyticsState.overview?.daily || [];
        if (!daily.length) {
            return `<article class="admin-placeholder-card"><strong>No daily analytics yet</strong><p>Daily totals will appear as events arrive.</p></article>`;
        }

        return `
            <div class="admin-analytics-table" role="table" aria-label="Daily analytics">
                <div class="admin-analytics-row admin-analytics-row--head" role="row">
                    <span>Day</span>
                    <span>Views</span>
                    <span>Game views</span>
                    <span>Game plays</span>
                    <span>Admin views</span>
                </div>
                ${daily.map((day) => `
                    <div class="admin-analytics-row" role="row">
                        <span>${escapeHtml(day.dayKey)}</span>
                        <span>${escapeHtml(formatNumber(day.totalPageViews))}</span>
                        <span>${escapeHtml(formatNumber(day.totalGameViews))}</span>
                        <span>${escapeHtml(formatNumber(day.totalGamePlays))}</span>
                        <span>${escapeHtml(formatNumber(day.adminPageViews))}</span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderAnalyticsEventsSection() {
        return `
            <form class="admin-feedback-filters admin-analytics-filters" data-analytics-events-filters>
                <label>
                    <span>Event</span>
                    <select name="eventType">
                        <option value="">All</option>
                        ${ANALYTICS_EVENT_TYPES.map((type) => `<option value="${type}"${analyticsState.eventsFilters.eventType === type ? " selected" : ""}>${escapeHtml(titleCase(type))}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Game</span>
                    <input name="gameSlug" type="search" value="${escapeHtml(analyticsState.eventsFilters.gameSlug)}" placeholder="game slug">
                </label>
                <label>
                    <span>Source</span>
                    <input name="source" type="search" value="${escapeHtml(analyticsState.eventsFilters.source)}" placeholder="google, direct">
                </label>
                <div class="admin-feedback-filter-actions">
                    <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                    <button class="premium-ghost-button" type="button" data-analytics-events-clear>${icon("close")}<span>Clear</span></button>
                </div>
            </form>
            ${renderAnalyticsEventsList()}
        `;
    }

    function renderAnalyticsEventsList() {
        if (analyticsState.eventsLoading) {
            return `<article class="admin-placeholder-card"><strong>Loading recent events...</strong><p>Fetching recent analytics events.</p></article>`;
        }
        if (analyticsState.eventsError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load recent events</strong><p>${escapeHtml(analyticsState.eventsError)}</p></article>`;
        }
        if (!analyticsState.events.length) {
            return `<article class="admin-placeholder-card"><strong>No recent events</strong><p>Analytics events will appear here after tracking begins.</p></article>`;
        }

        return `
            <div class="admin-analytics-table" role="table" aria-label="Recent analytics events">
                <div class="admin-analytics-row admin-analytics-row--head" role="row">
                    <span>Date</span>
                    <span>Event</span>
                    <span>Game/Page</span>
                    <span>Source</span>
                    <span>Device</span>
                </div>
                ${analyticsState.events.map((event) => `
                    <div class="admin-analytics-row" role="row">
                        <span>${escapeHtml(formatDate(event.createdAt))}</span>
                        <span>${escapeHtml(titleCase(event.eventType))}</span>
                        <span>${escapeHtml(shortText(event.gameTitle || event.gameSlug || event.path, 90))}</span>
                        <span>${escapeHtml(titleCase(event.source))}</span>
                        <span>${escapeHtml(titleCase(event.deviceType))}</span>
                    </div>
                `).join("")}
            </div>
            ${analyticsState.eventsNextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-analytics-events-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderGamesPanel(panel, module) {
        const totals = gamesState.overview?.totals || {};
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Manage safe catalog overlays for visibility, labels, priority, and maintenance without editing game files.</p>
            </div>
            ${renderAdminNotice()}
            <div class="admin-feedback-summary admin-games-summary">
                ${renderFeedbackSummaryCard("Total games", gamesState.overview ? formatNumber(totals.totalGames) : gamesState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Public", gamesState.overview ? formatNumber(totals.publicGames) : gamesState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Hidden", gamesState.overview ? formatNumber(totals.hiddenGames) : gamesState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Coming Soon", gamesState.overview ? formatNumber(totals.comingSoonGames) : gamesState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Maintenance", gamesState.overview ? formatNumber(totals.maintenanceGames) : gamesState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Open Bugs", gamesState.overview ? formatNumber(totals.gamesWithOpenBugs) : gamesState.overviewError ? "Unavailable" : "Loading...")}
            </div>
            ${gamesState.overviewError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Catalog overview unavailable</strong><p>${escapeHtml(gamesState.overviewError)}</p></article>` : ""}
            <form class="admin-feedback-filters admin-games-filters" data-catalog-filters>
                <label>
                    <span>Search</span>
                    <input name="search" type="search" value="${escapeHtml(gamesState.filters.search)}" placeholder="title, slug, note">
                </label>
                <label>
                    <span>Catalog</span>
                    <select name="catalog">
                        ${["", "public", "premium"].map((value) => `<option value="${value}"${gamesState.filters.catalog === value ? " selected" : ""}>${escapeHtml(value ? titleCase(value) : "All")}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Visibility</span>
                    <select name="visibility">
                        ${["", "public", "hidden", "coming_soon", "maintenance"].map((value) => `<option value="${value}"${gamesState.filters.visibility === value ? " selected" : ""}>${escapeHtml(value ? titleCase(value) : "All")}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Category</span>
                    <input name="category" type="search" value="${escapeHtml(gamesState.filters.category)}" placeholder="Arcade, Strategy">
                </label>
                <label>
                    <span>Featured</span>
                    <select name="featured">
                        ${["", "true", "false"].map((value) => `<option value="${value}"${gamesState.filters.featured === value ? " selected" : ""}>${escapeHtml(value === "true" ? "Featured" : value === "false" ? "Not featured" : "All")}</option>`).join("")}
                    </select>
                </label>
                <div class="admin-feedback-filter-actions">
                    <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                    <button class="premium-ghost-button" type="button" data-catalog-clear>${icon("close")}<span>Clear</span></button>
                </div>
            </form>
            ${renderCatalogGamesList()}
            ${renderCatalogDetail()}
            ${renderCatalogActionModal()}
        `;

        bindGamesPanel(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!gamesState.overview && !gamesState.overviewLoading && !gamesState.overviewError) {
            void loadCatalogOverview({ silent: true });
        }
        if (!gamesState.loaded && !gamesState.loading) {
            void loadCatalogGames({ silent: true });
        }
    }

    function renderCatalogGamesList() {
        if (gamesState.loading) {
            return `<article class="admin-placeholder-card"><strong>Loading catalog games...</strong><p>Fetching public and premium catalog overlays.</p></article>`;
        }
        if (gamesState.error) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load catalog games</strong><p>${escapeHtml(gamesState.error)}</p></article>`;
        }
        if (!gamesState.items.length) {
            return `<article class="admin-placeholder-card"><strong>No catalog games found</strong><p>Try clearing filters or refreshing the catalog.</p></article>`;
        }

        return `
            <div class="admin-games-table admin-catalog-table" role="table" aria-label="Catalog operations">
                <div class="admin-games-row admin-games-row--head" role="row">
                    <span>Game</span>
                    <span>Catalog</span>
                    <span>Slug</span>
                    <span>Visibility</span>
                    <span>Labels</span>
                    <span>Priority</span>
                    <span>Plays</span>
                    <span>Actions</span>
                </div>
                ${gamesState.items.map((game) => `
                    <div class="admin-games-row" role="row">
                        <span>${escapeHtml(shortText(game.title || game.slug, 70))}</span>
                        <span>${escapeHtml(titleCase(game.catalog))}</span>
                        <span>${escapeHtml(game.slug)}</span>
                        <span>${renderStatusPill(game.visibility || "public")}</span>
                        <span>${renderCatalogLabels(game)}</span>
                        <span>${escapeHtml(formatNumber(game.priority))}</span>
                        <span>${escapeHtml(formatNumber(game.analyticsSummary?.totalPlays || 0))}</span>
                        <span class="admin-table-actions">
                            <button type="button" data-catalog-view="${escapeHtml(game.slug)}" data-catalog="${escapeHtml(game.catalog)}">View</button>
                            <button type="button" data-catalog-action="visibility" data-catalog-slug="${escapeHtml(game.slug)}" data-catalog="${escapeHtml(game.catalog)}">Visibility</button>
                            <button type="button" data-catalog-action="labels" data-catalog-slug="${escapeHtml(game.slug)}" data-catalog="${escapeHtml(game.catalog)}">Labels</button>
                            <button type="button" data-catalog-action="priority" data-catalog-slug="${escapeHtml(game.slug)}" data-catalog="${escapeHtml(game.catalog)}">Priority</button>
                            <button type="button" data-catalog-action="note" data-catalog-slug="${escapeHtml(game.slug)}" data-catalog="${escapeHtml(game.catalog)}">Note</button>
                        </span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderCatalogLabels(game) {
        const labels = [];
        if (game.featured) labels.push("Featured");
        if (game.newLabel) labels.push("New");
        if (game.updatedLabel) labels.push("Updated");
        if (game.trendingLabel) labels.push("Trending");
        if (game.launchDisabled) labels.push("Launch off");
        return labels.length
            ? labels.map((label) => `<span class="admin-status-pill">${escapeHtml(label)}</span>`).join("")
            : `<span class="admin-muted">None</span>`;
    }

    function renderCatalogDetail() {
        if (gamesState.detailLoading) {
            return `<section class="admin-feedback-detail is-open"><button class="admin-feedback-detail-backdrop" type="button" data-catalog-detail-close></button><article class="admin-feedback-detail-panel"><strong>Loading catalog detail...</strong></article></section>`;
        }
        if (gamesState.detailError) {
            return `<section class="admin-feedback-detail is-open"><button class="admin-feedback-detail-backdrop" type="button" data-catalog-detail-close></button><article class="admin-feedback-detail-panel"><button class="admin-feedback-detail-close" type="button" data-catalog-detail-close>X</button><strong>Catalog detail unavailable</strong><p>${escapeHtml(gamesState.detailError)}</p></article></section>`;
        }
        const detail = gamesState.detail;
        if (!detail) {
            return "";
        }
        const game = detail.merged || {};
        const override = detail.override || {};
        return `
            <section class="admin-feedback-detail is-open" aria-modal="true" role="dialog">
                <button class="admin-feedback-detail-backdrop" type="button" data-catalog-detail-close aria-label="Close catalog detail"></button>
                <article class="admin-feedback-detail-panel">
                    <button class="admin-feedback-detail-close" type="button" data-catalog-detail-close aria-label="Close">X</button>
                    <p class="premium-kicker">Catalog Detail</p>
                    <h2>${escapeHtml(game.title || game.slug)}</h2>
                    <div class="admin-detail-grid">
                        <article><span>Catalog</span><strong>${escapeHtml(titleCase(game.catalog))}</strong></article>
                        <article><span>Visibility</span><strong>${escapeHtml(titleCase(game.visibility))}</strong></article>
                        <article><span>Priority</span><strong>${escapeHtml(formatNumber(game.priority))}</strong></article>
                        <article><span>Launch</span><strong>${escapeHtml(game.launchDisabled ? "Disabled" : "Enabled")}</strong></article>
                    </div>
                    <article class="admin-placeholder-card">
                        <strong>Player-facing maintenance message</strong>
                        <p>${escapeHtml(game.maintenanceMessage || "No message set.")}</p>
                    </article>
                    <article class="admin-placeholder-card">
                        <strong>Admin note</strong>
                        <p>${escapeHtml(override.adminNote || "No admin note set.")}</p>
                    </article>
                    <div class="admin-feedback-summary">
                        ${renderFeedbackSummaryCard("Views", formatNumber(detail.analyticsSummary?.totalViews || 0))}
                        ${renderFeedbackSummaryCard("Plays", formatNumber(detail.analyticsSummary?.totalPlays || 0))}
                        ${renderFeedbackSummaryCard("Feedback", formatNumber(detail.feedbackSummary?.total || 0))}
                        ${renderFeedbackSummaryCard("Open Bugs", formatNumber(detail.feedbackSummary?.openBugs || 0))}
                    </div>
                    <article class="admin-placeholder-card">
                        <strong>Recent feedback</strong>
                        ${(detail.recentFeedback || []).length ? (detail.recentFeedback || []).map((item) => `<p>${escapeHtml(shortText(item.message, 160))}</p>`).join("") : "<p>No recent feedback.</p>"}
                    </article>
                    <article class="admin-placeholder-card">
                        <strong>Recent operations audit</strong>
                        ${(detail.auditHistory || []).length ? (detail.auditHistory || []).map((item) => `<p>${escapeHtml(formatDate(item.createdAt))} / ${escapeHtml(item.action)} / ${escapeHtml(shortText(item.reason, 120))}</p>`).join("") : "<p>No catalog audit history yet.</p>"}
                    </article>
                </article>
            </section>
        `;
    }

    function renderCatalogActionModal() {
        const modal = gamesState.modal;
        if (!modal) {
            return "";
        }
        const game = modal.game || {};
        return `
            <section class="admin-feedback-detail is-open" aria-modal="true" role="dialog">
                <button class="admin-feedback-detail-backdrop" type="button" data-catalog-modal-close aria-label="Close catalog action"></button>
                <article class="admin-feedback-detail-panel">
                    <button class="admin-feedback-detail-close" type="button" data-catalog-modal-close aria-label="Close">X</button>
                    <p class="premium-kicker">Catalog Operation</p>
                    <h2>${escapeHtml(modal.title || "Catalog action")}</h2>
                    <p>${escapeHtml(game.title || game.slug || "")}</p>
                    ${gamesState.actionError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Action failed</strong><p>${escapeHtml(gamesState.actionError)}</p></article>` : ""}
                    ${renderCatalogActionForm(modal)}
                </article>
            </section>
        `;
    }

    function renderCatalogActionForm(modal) {
        const game = modal.game || {};
        if (modal.type === "visibility") {
            const dangerous = game.visibility !== "public" || game.launchDisabled;
            return `
                <form class="admin-feedback-note-form" data-catalog-action-form="visibility">
                    <label><span>Visibility</span><select name="visibility">${["public", "hidden", "coming_soon", "maintenance"].map((value) => `<option value="${value}"${game.visibility === value ? " selected" : ""}>${escapeHtml(titleCase(value))}</option>`).join("")}</select></label>
                    <label><span>Launch disabled</span><select name="launchDisabled"><option value="false"${!game.launchDisabled ? " selected" : ""}>No</option><option value="true"${game.launchDisabled ? " selected" : ""}>Yes</option></select></label>
                    <label><span>Maintenance message</span><textarea name="maintenanceMessage" maxlength="500">${escapeHtml(game.maintenanceMessage || "")}</textarea></label>
                    <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                    <label class="admin-confirm-line"><input type="checkbox" name="confirmed" ${dangerous ? "" : "checked"}> <span>I understand this can change player visibility or launch access.</span></label>
                    <button class="premium-primary-button" type="submit" ${gamesState.pending ? "disabled" : ""}>${icon("check")}<span>${gamesState.pending ? "Saving..." : "Save visibility"}</span></button>
                </form>
            `;
        }
        if (modal.type === "labels") {
            return `
                <form class="admin-feedback-note-form" data-catalog-action-form="labels">
                    ${["featured", "newLabel", "updatedLabel", "trendingLabel"].map((key) => `<label class="admin-confirm-line"><input type="checkbox" name="${key}" ${game[key] ? "checked" : ""}> <span>${escapeHtml(titleCase(key))}</span></label>`).join("")}
                    <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                    <button class="premium-primary-button" type="submit" ${gamesState.pending ? "disabled" : ""}>${icon("check")}<span>${gamesState.pending ? "Saving..." : "Save labels"}</span></button>
                </form>
            `;
        }
        if (modal.type === "priority") {
            return `
                <form class="admin-feedback-note-form" data-catalog-action-form="priority">
                    <label><span>Priority</span><input name="priority" type="number" min="-9999" max="9999" value="${escapeHtml(game.priority || 0)}"></label>
                    <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                    <button class="premium-primary-button" type="submit" ${gamesState.pending ? "disabled" : ""}>${icon("check")}<span>${gamesState.pending ? "Saving..." : "Save priority"}</span></button>
                </form>
            `;
        }
        return `
            <form class="admin-feedback-note-form" data-catalog-action-form="note">
                <label><span>Admin note</span><textarea name="adminNote" maxlength="1000">${escapeHtml(game.adminNote || "")}</textarea></label>
                <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                <button class="premium-primary-button" type="submit" ${gamesState.pending ? "disabled" : ""}>${icon("check")}<span>${gamesState.pending ? "Saving..." : "Save note"}</span></button>
            </form>
        `;
    }

    function bindAnalyticsPanel(panel) {
        const filters = panel.querySelector("[data-analytics-events-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            analyticsState.eventsFilters = {
                eventType: String(formData.get("eventType") || ""),
                gameSlug: String(formData.get("gameSlug") || "").trim(),
                source: String(formData.get("source") || "").trim()
            };
            analyticsState.eventsLoaded = false;
            void loadAnalyticsEvents();
        });

        panel.querySelector("[data-analytics-events-clear]")?.addEventListener("click", () => {
            analyticsState.eventsFilters = {
                eventType: "",
                gameSlug: "",
                source: ""
            };
            analyticsState.eventsLoaded = false;
            void loadAnalyticsEvents();
        });

        panel.querySelector("[data-analytics-events-load-more]")?.addEventListener("click", () => {
            if (analyticsState.eventsNextCursor) {
                void loadAnalyticsEvents({
                    cursor: analyticsState.eventsNextCursor,
                    append: true
                });
            }
        });
    }

    function bindGamesPanel(panel) {
        const filters = panel.querySelector("[data-catalog-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            gamesState.filters = {
                search: String(formData.get("search") || "").trim(),
                catalog: String(formData.get("catalog") || "").trim(),
                category: String(formData.get("category") || "").trim(),
                visibility: String(formData.get("visibility") || "").trim(),
                featured: String(formData.get("featured") || "").trim()
            };
            gamesState.loaded = false;
            void loadCatalogGames();
        });
        panel.querySelector("[data-catalog-clear]")?.addEventListener("click", () => {
            gamesState.filters = { search: "", catalog: "", category: "", visibility: "", featured: "" };
            gamesState.loaded = false;
            void loadCatalogGames();
        });
        panel.querySelectorAll("[data-catalog-view]").forEach((button) => {
            button.addEventListener("click", () => {
                void loadCatalogDetail(button.dataset.catalogView, button.dataset.catalog);
            });
        });
        panel.querySelectorAll("[data-catalog-action]").forEach((button) => {
            button.addEventListener("click", () => {
                const game = gamesState.items.find((item) => item.slug === button.dataset.catalogSlug && item.catalog === button.dataset.catalog);
                gamesState.modal = {
                    type: button.dataset.catalogAction,
                    title: titleCase(button.dataset.catalogAction || "catalog"),
                    game
                };
                gamesState.actionError = "";
                renderActivePanel();
            });
        });
        panel.querySelectorAll("[data-catalog-detail-close], [data-catalog-modal-close]").forEach((button) => {
            button.addEventListener("click", () => {
                gamesState.detail = null;
                gamesState.detailError = "";
                gamesState.modal = null;
                gamesState.actionError = "";
                renderActivePanel();
            });
        });
        panel.querySelector("[data-catalog-action-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            void submitCatalogAction(event.currentTarget);
        });
    }

    async function submitCatalogAction(form) {
        const modal = gamesState.modal;
        const game = modal?.game;
        if (!game) {
            return;
        }
        const formData = new FormData(form);
        const action = form.dataset.catalogActionForm;
        let path = `/api/admin/catalog/games/${encodeURIComponent(game.slug)}/${action}`;
        const body = {
            catalog: game.catalog,
            reason: String(formData.get("reason") || "").trim()
        };

        if (action === "visibility") {
            body.visibility = String(formData.get("visibility") || "public");
            body.launchDisabled = String(formData.get("launchDisabled") || "false") === "true";
            body.maintenanceMessage = String(formData.get("maintenanceMessage") || "");
            body.confirmed = formData.get("confirmed") === "on";
        } else if (action === "labels") {
            body.featured = formData.get("featured") === "on";
            body.newLabel = formData.get("newLabel") === "on";
            body.updatedLabel = formData.get("updatedLabel") === "on";
            body.trendingLabel = formData.get("trendingLabel") === "on";
        } else if (action === "priority") {
            body.priority = Number(formData.get("priority") || 0);
        } else if (action === "note") {
            body.adminNote = String(formData.get("adminNote") || "");
        } else {
            return;
        }

        gamesState.pending = true;
        gamesState.actionError = "";
        renderActivePanel();
        try {
            await adminFetch(path, {
                method: "PATCH",
                body: JSON.stringify(body)
            });
            accountsState.actionNotice = {
                type: "success",
                text: "Catalog operation saved."
            };
            gamesState.modal = null;
            gamesState.pending = false;
            await Promise.all([loadCatalogOverview({ silent: true }), loadCatalogGames({ silent: true }), auditState.loaded ? loadAuditLogs({ silent: true }) : Promise.resolve()]);
        } catch (error) {
            gamesState.pending = false;
            gamesState.actionError = error?.message || "Catalog operation failed.";
            renderActivePanel();
        }
    }

    function renderOperationsPanel(panel, module) {
        const config = operationsState.config || {};
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Manage global player notices, maintenance mode, and known safe feature flags.</p>
            </div>
            ${renderAdminNotice()}
            ${operationsState.error ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Operations unavailable</strong><p>${escapeHtml(operationsState.error)}</p></article>` : ""}
            <div class="admin-feedback-summary admin-games-summary">
                ${renderFeedbackSummaryCard("Banner", config.globalBannerEnabled ? "Enabled" : "Off")}
                ${renderFeedbackSummaryCard("Maintenance", config.globalMaintenanceMode ? "Enabled" : "Off")}
                ${renderFeedbackSummaryCard("Flags", formatNumber(operationsState.featureFlags.length))}
                ${renderFeedbackSummaryCard("Storage", operationsState.storageMode || "Loading")}
            </div>
            <section class="admin-readonly-section">
                <div class="admin-section-title-row">
                    <div>
                        <h3>Global Operations</h3>
                        <p>Admin remains accessible even when player launch maintenance is enabled.</p>
                    </div>
                    <button class="premium-primary-button" type="button" data-operations-config-edit>${icon("settings")}<span>Edit config</span></button>
                </div>
                <article class="admin-placeholder-card">
                    <strong>${escapeHtml(config.globalMaintenanceMode ? "Maintenance mode enabled" : "Maintenance mode off")}</strong>
                    <p>${escapeHtml(config.globalMaintenanceMessage || config.globalBannerMessage || "No public operations message is currently set.")}</p>
                </article>
            </section>
            <section class="admin-readonly-section">
                <div class="admin-section-title-row">
                    <div>
                        <h3>Feature Flags</h3>
                        <p>Only known safe flags are editable. No auth or billing controls are exposed here.</p>
                    </div>
                </div>
                ${renderFeatureFlagsList()}
            </section>
            ${renderOperationsModal()}
        `;
        bindOperationsPanel(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!operationsState.loaded && !operationsState.loading) {
            void Promise.all([loadOperationsConfig({ silent: true }), loadFeatureFlags({ silent: true })]);
        }
    }

    function renderFeatureFlagsList() {
        if (operationsState.loading && !operationsState.featureFlags.length) {
            return `<article class="admin-placeholder-card"><strong>Loading feature flags...</strong><p>Fetching safe operations flags.</p></article>`;
        }
        if (!operationsState.featureFlags.length) {
            return `<article class="admin-placeholder-card"><strong>No flags connected</strong><p>Known safe flags will appear here when operations storage is ready.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-audit-table" role="table" aria-label="Feature flags">
                <div class="admin-data-row admin-data-row--head" role="row">
                    <span>Flag</span>
                    <span>Status</span>
                    <span>Description</span>
                    <span>Updated</span>
                    <span>Actions</span>
                </div>
                ${operationsState.featureFlags.map((flag) => `
                    <div class="admin-data-row" role="row">
                        <span>${escapeHtml(flag.key)}</span>
                        <span>${renderStatusPill(flag.enabled ? "enabled" : "disabled")}</span>
                        <span>${escapeHtml(shortText(flag.description, 120))}</span>
                        <span>${escapeHtml(formatDate(flag.updatedAt))}</span>
                        <span class="admin-table-actions"><button type="button" data-feature-flag-edit="${escapeHtml(flag.key)}">Edit</button></span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderOperationsModal() {
        const modal = operationsState.modal;
        if (!modal) {
            return "";
        }
        return `
            <section class="admin-feedback-detail is-open" aria-modal="true" role="dialog">
                <button class="admin-feedback-detail-backdrop" type="button" data-operations-modal-close aria-label="Close operations action"></button>
                <article class="admin-feedback-detail-panel">
                    <button class="admin-feedback-detail-close" type="button" data-operations-modal-close aria-label="Close">X</button>
                    <p class="premium-kicker">Operations</p>
                    <h2>${escapeHtml(modal.title || "Operations action")}</h2>
                    ${operationsState.actionError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Action failed</strong><p>${escapeHtml(operationsState.actionError)}</p></article>` : ""}
                    ${modal.type === "flag" ? renderFeatureFlagForm(modal.flag) : renderOperationsConfigForm()}
                </article>
            </section>
        `;
    }

    function renderOperationsConfigForm() {
        const config = operationsState.config || {};
        return `
            <form class="admin-feedback-note-form" data-operations-action-form="config">
                <label class="admin-confirm-line"><input type="checkbox" name="globalBannerEnabled" ${config.globalBannerEnabled ? "checked" : ""}> <span>Enable global banner</span></label>
                <label><span>Banner message</span><textarea name="globalBannerMessage" maxlength="500">${escapeHtml(config.globalBannerMessage || "")}</textarea></label>
                <label class="admin-confirm-line"><input type="checkbox" name="globalMaintenanceMode" ${config.globalMaintenanceMode ? "checked" : ""}> <span>Enable global maintenance mode</span></label>
                <label><span>Maintenance message</span><textarea name="globalMaintenanceMessage" maxlength="500">${escapeHtml(config.globalMaintenanceMessage || "")}</textarea></label>
                <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                <label class="admin-confirm-line"><input type="checkbox" name="confirmed"> <span>I understand this can block players from launching games.</span></label>
                <button class="premium-primary-button" type="submit" ${operationsState.pending ? "disabled" : ""}>${icon("check")}<span>${operationsState.pending ? "Saving..." : "Save operations config"}</span></button>
            </form>
        `;
    }

    function renderFeatureFlagForm(flag = {}) {
        return `
            <form class="admin-feedback-note-form" data-operations-action-form="flag">
                <input type="hidden" name="key" value="${escapeHtml(flag.key || "")}">
                <label class="admin-confirm-line"><input type="checkbox" name="enabled" ${flag.enabled ? "checked" : ""}> <span>Enabled</span></label>
                <label><span>Description</span><textarea name="description" maxlength="500">${escapeHtml(flag.description || "")}</textarea></label>
                <label><span>Reason</span><textarea name="reason" maxlength="500" required></textarea></label>
                <button class="premium-primary-button" type="submit" ${operationsState.pending ? "disabled" : ""}>${icon("check")}<span>${operationsState.pending ? "Saving..." : "Save feature flag"}</span></button>
            </form>
        `;
    }

    function bindOperationsPanel(panel) {
        panel.querySelector("[data-operations-config-edit]")?.addEventListener("click", () => {
            operationsState.modal = { type: "config", title: "Edit operations config" };
            operationsState.actionError = "";
            renderActivePanel();
        });
        panel.querySelectorAll("[data-feature-flag-edit]").forEach((button) => {
            button.addEventListener("click", () => {
                const flag = operationsState.featureFlags.find((item) => item.key === button.dataset.featureFlagEdit);
                operationsState.modal = { type: "flag", title: `Edit ${button.dataset.featureFlagEdit}`, flag };
                operationsState.actionError = "";
                renderActivePanel();
            });
        });
        panel.querySelectorAll("[data-operations-modal-close]").forEach((button) => {
            button.addEventListener("click", () => {
                operationsState.modal = null;
                operationsState.actionError = "";
                renderActivePanel();
            });
        });
        panel.querySelector("[data-operations-action-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            void submitOperationsAction(event.currentTarget);
        });
    }

    async function submitOperationsAction(form) {
        const formData = new FormData(form);
        const action = form.dataset.operationsActionForm;
        let path = "/api/admin/operations/config";
        const body = {
            reason: String(formData.get("reason") || "").trim()
        };
        if (action === "config") {
            body.globalBannerEnabled = formData.get("globalBannerEnabled") === "on";
            body.globalBannerMessage = String(formData.get("globalBannerMessage") || "");
            body.globalMaintenanceMode = formData.get("globalMaintenanceMode") === "on";
            body.globalMaintenanceMessage = String(formData.get("globalMaintenanceMessage") || "");
            body.confirmed = formData.get("confirmed") === "on";
        } else if (action === "flag") {
            const key = String(formData.get("key") || "");
            path = `/api/admin/feature-flags/${encodeURIComponent(key)}`;
            body.enabled = formData.get("enabled") === "on";
            body.description = String(formData.get("description") || "");
        } else {
            return;
        }
        operationsState.pending = true;
        operationsState.actionError = "";
        renderActivePanel();
        try {
            await adminFetch(path, {
                method: "PATCH",
                body: JSON.stringify(body)
            });
            accountsState.actionNotice = {
                type: "success",
                text: "Operations setting saved."
            };
            operationsState.modal = null;
            operationsState.pending = false;
            await Promise.all([loadOperationsConfig({ silent: true }), loadFeatureFlags({ silent: true }), auditState.loaded ? loadAuditLogs({ silent: true }) : Promise.resolve()]);
        } catch (error) {
            operationsState.pending = false;
            operationsState.actionError = error?.message || "Operations update failed.";
            renderActivePanel();
        }
    }

    function renderAdminNotice() {
        const notice = accountsState.actionNotice;
        if (!notice?.text) {
            return "";
        }
        return `
            <article class="admin-action-notice is-${escapeHtml(notice.type || "info")}">
                <strong>${escapeHtml(notice.type === "error" ? "Action failed" : "Action complete")}</strong>
                <p>${escapeHtml(notice.text)}</p>
                <button type="button" data-admin-notice-close aria-label="Dismiss notice">X</button>
            </article>
        `;
    }

    function bindAdminNotice(panel) {
        panel.querySelector("[data-admin-notice-close]")?.addEventListener("click", () => {
            accountsState.actionNotice = null;
            renderActivePanel();
        });
    }

    function renderUsersPanel(panel, module) {
        const totals = accountsState.overview?.totals || {};
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Premium account visibility with audited support-only entitlement actions.</p>
            </div>
            ${renderAdminNotice()}
            <div class="admin-feedback-summary admin-account-summary">
                ${renderFeedbackSummaryCard("Total users", accountsState.overview ? formatMetricValue(totals.totalUsers) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("New today", accountsState.overview ? formatMetricValue(totals.newUsersToday) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Premium users", accountsState.overview ? formatMetricValue(totals.premiumUsers) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Expired premium", accountsState.overview ? formatMetricValue(totals.expiredPremiumUsers) : accountsState.overviewError ? "Unavailable" : "Loading...")}
            </div>
            <form class="admin-feedback-filters admin-users-filters" data-users-filters>
                <label>
                    <span>Search</span>
                    <input name="search" type="search" value="${escapeHtml(accountsState.usersFilters.search)}" placeholder="email, name, uid">
                </label>
                <label>
                    <span>Status</span>
                    <select name="status">
                        ${USER_STATUSES.map((status) => `<option value="${status}"${accountsState.usersFilters.status === status ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Plan</span>
                    <input name="plan" type="search" value="${escapeHtml(accountsState.usersFilters.plan)}" placeholder="premium, pass, tier">
                </label>
                <div class="admin-feedback-filter-actions">
                    <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                    <button class="premium-ghost-button" type="button" data-users-clear>${icon("close")}<span>Clear</span></button>
                </div>
            </form>
            ${renderUsersList()}
            ${renderUserDetail()}
            ${renderEntitlementActionModal()}
            ${renderModerationModal()}
        `;

        bindUsersPanel(panel);
        bindEntitlementActionModal(panel);
        bindModerationModal(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!accountsState.overview && !accountsState.overviewLoading && !accountsState.overviewError) {
            void loadAccountsOverview({ silent: true });
        }
        if (!accountsState.usersLoaded && !accountsState.usersLoading) {
            void loadUsers({ silent: true });
        }
    }

    function renderUsersList() {
        if (accountsState.usersLoading) {
            return `<article class="admin-placeholder-card"><strong>Loading users...</strong><p>Fetching safe Premium account records.</p></article>`;
        }
        if (accountsState.usersError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load users</strong><p>${escapeHtml(accountsState.usersError)}</p></article>`;
        }
        if (!accountsState.dataConnected) {
            return `<article class="admin-placeholder-card"><strong>No records connected yet</strong><p>Firebase Admin credentials are not configured in this local/dev environment.</p></article>`;
        }
        if (!accountsState.users.length) {
            return `<article class="admin-placeholder-card"><strong>No users found</strong><p>No records connected yet.</p></article>`;
        }

        return `
            <div class="admin-data-table admin-users-table" role="table" aria-label="Users">
                <div class="admin-data-row admin-data-row--head admin-users-row" role="row">
                    <span>Email</span>
                    <span>Name</span>
                    <span>Plan / status</span>
                    <span>Entitlements</span>
                    <span>Created</span>
                    <span>Last login</span>
                    <span>Action</span>
                </div>
                ${accountsState.users.map((user) => `
                    <div class="admin-data-row admin-users-row" role="row">
                        <span>${escapeHtml(user.email || "Unknown")}</span>
                        <span>${escapeHtml(user.displayName || "Unknown")}</span>
                        <span>${renderStatusPill(user.premiumStatus)}<small>${escapeHtml(user.plan || "free")}</small></span>
                        <span>${escapeHtml(`${user.activeEntitlementsCount || 0} active / ${user.expiredEntitlementsCount || 0} expired`)}</span>
                        <span>${escapeHtml(formatDate(user.createdAt))}</span>
                        <span>${escapeHtml(formatDate(user.lastLoginAt))}</span>
                        <span class="admin-feedback-actions-cell">
                            <button type="button" data-user-view="${escapeHtml(user.id)}">View</button>
                        </span>
                    </div>
                `).join("")}
            </div>
            ${accountsState.usersNextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-users-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderStatusPill(status) {
        const normalized = String(status || "unknown").toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
        return `<em class="admin-feedback-status-pill is-${escapeHtml(normalized)}">${escapeHtml(titleCase(normalized))}</em>`;
    }

    function renderUserDetail() {
        if (accountsState.userDetailLoading) {
            return `
                <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="User detail loading">
                    <button class="admin-feedback-detail-backdrop" type="button" data-user-detail-close aria-label="Close user detail"></button>
                    <section class="admin-feedback-detail-card">
                        <button class="admin-feedback-detail-close" type="button" data-user-detail-close aria-label="Close">X</button>
                        <p class="premium-kicker">User Detail</p>
                        <h3>Loading safe user record</h3>
                        <p>Fetching account, entitlement, and owned item visibility.</p>
                    </section>
                </div>
            `;
        }
        if (!accountsState.userDetail && !accountsState.userDetailError) {
            return "";
        }

        const user = accountsState.userDetail;
        return `
            <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="User detail">
                <button class="admin-feedback-detail-backdrop" type="button" data-user-detail-close aria-label="Close user detail"></button>
                <section class="admin-feedback-detail-card admin-user-detail-card">
                    <button class="admin-feedback-detail-close" type="button" data-user-detail-close aria-label="Close">X</button>
                    <p class="premium-kicker">Admin User Detail</p>
                    <h3>${escapeHtml(user?.email || "No user detail")}</h3>
                    ${accountsState.userDetailError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Detail unavailable</strong><p>${escapeHtml(accountsState.userDetailError)}</p></article>` : `
                        <dl class="admin-feedback-detail-meta">
                            <div><dt>Name</dt><dd>${escapeHtml(user.displayName || "Unknown")}</dd></div>
                            <div><dt>User ID</dt><dd>${escapeHtml(shortId(user.id))}</dd></div>
                            <div><dt>Plan</dt><dd>${escapeHtml(user.plan || "free")}</dd></div>
                            <div><dt>Status</dt><dd>${escapeHtml(titleCase(user.premiumStatus || "unknown"))}</dd></div>
                            <div><dt>Created</dt><dd>${escapeHtml(formatDate(user.createdAt))}</dd></div>
                            <div><dt>Last login</dt><dd>${escapeHtml(formatDate(user.lastLoginAt))}</dd></div>
                        </dl>
                        ${renderDetailList("Entitlements", user.entitlements, renderUserEntitlementItem)}
                        ${renderDetailList("Owned Items", user.ownedItems, renderUserOwnedItem)}
                        ${renderUserAuditHistory()}
                        ${renderUserModerationHistory()}
                    `}
                    <div class="admin-feedback-detail-actions">
                        ${user && !accountsState.userDetailError ? `<button class="premium-primary-button" type="button" data-entitlement-action="grant" data-user-email="${escapeHtml(user.email || "")}" data-user-id="${escapeHtml(user.id || "")}">${icon("check")}<span>Grant entitlement</span></button>` : ""}
                        ${user && !accountsState.userDetailError ? `<button class="premium-ghost-button" type="button" data-user-moderation-note data-user-email="${escapeHtml(user.email || "")}" data-user-id="${escapeHtml(user.id || "")}">${icon("shield")}<span>Add moderation note</span></button>` : ""}
                        ${user && !accountsState.userDetailError ? `<button class="premium-ghost-button" type="button" data-user-feedback-mute data-user-email="${escapeHtml(user.email || "")}">${icon("close")}<span>Feedback mute</span></button>` : ""}
                        <button class="premium-ghost-button" type="button" data-user-detail-close>${icon("close")}<span>Close</span></button>
                    </div>
                </section>
            </div>
        `;
    }

    function renderDetailList(title, items = [], renderer) {
        if (!items.length) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>${escapeHtml(title)}</strong>
                    <p>No records connected yet.</p>
                </div>
            `;
        }
        return `
            <div class="admin-feedback-message-full">
                <strong>${escapeHtml(title)}</strong>
                <div class="admin-mini-list">
                    ${items.map(renderer).join("")}
                </div>
            </div>
        `;
    }

    function renderUserEntitlementItem(item) {
        return `
            <p>
                ${renderStatusPill(item.status)}
                <strong>${escapeHtml(item.entitlementType || "Entitlement")}</strong>
                ${escapeHtml(item.expiresAt ? `expires ${formatDate(item.expiresAt)}` : "no expiry")}
                <span class="admin-inline-actions">
                    <button type="button" data-entitlement-action="extend" data-entitlement-id="${escapeHtml(item.id)}">Extend</button>
                    <button type="button" data-entitlement-action="revoke" data-entitlement-id="${escapeHtml(item.id)}">Revoke</button>
                </span>
            </p>
        `;
    }

    function renderUserOwnedItem(item) {
        return `<p><strong>${escapeHtml(item.title || item.itemId || "Owned item")}</strong> ${escapeHtml(item.category || "item")} ${escapeHtml(formatDate(item.createdAt))}</p>`;
    }

    function renderUserAuditHistory() {
        if (accountsState.userAuditLoading) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Admin action history</strong>
                    <p>Loading recent support actions...</p>
                </div>
            `;
        }
        if (accountsState.userAuditError) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Admin action history</strong>
                    <p>${escapeHtml(accountsState.userAuditError)}</p>
                </div>
            `;
        }
        if (!accountsState.userAuditLogs.length) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Admin action history</strong>
                    <p>No recent admin actions for this user.</p>
                </div>
            `;
        }
        return `
            <div class="admin-feedback-message-full">
                <strong>Admin action history</strong>
                <div class="admin-mini-list">
                    ${accountsState.userAuditLogs.map((item) => `
                        <p>
                            ${renderStatusPill(item.action || "action")}
                            <strong>${escapeHtml(formatDate(item.createdAt))}</strong>
                            ${escapeHtml(shortText(item.reason || item.targetId || "Admin action", 120))}
                        </p>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function renderUserModerationHistory() {
        if (accountsState.userModerationLoading) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Moderation history</strong>
                    <p>Loading recent moderation records...</p>
                </div>
            `;
        }
        if (accountsState.userModerationError) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Moderation history</strong>
                    <p>${escapeHtml(accountsState.userModerationError)}</p>
                </div>
            `;
        }
        if (!accountsState.userModerationRecords.length) {
            return `
                <div class="admin-feedback-message-full">
                    <strong>Moderation history</strong>
                    <p>No recent moderation records for this user.</p>
                </div>
            `;
        }
        return `
            <div class="admin-feedback-message-full">
                <strong>Moderation history</strong>
                <div class="admin-mini-list">
                    ${accountsState.userModerationRecords.map((item) => `
                        <p>
                            ${renderStatusPill(item.action || "moderation")}
                            <strong>${escapeHtml(formatDate(item.createdAt))}</strong>
                            ${escapeHtml(shortText(item.reason || item.adminNote || "Moderation record", 120))}
                        </p>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function bindUsersPanel(panel) {
        const filters = panel.querySelector("[data-users-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            accountsState.usersFilters = {
                search: String(formData.get("search") || "").trim(),
                status: String(formData.get("status") || "all"),
                plan: String(formData.get("plan") || "").trim()
            };
            accountsState.usersLoaded = false;
            void loadUsers();
        });

        panel.querySelector("[data-users-clear]")?.addEventListener("click", () => {
            accountsState.usersFilters = {
                search: "",
                status: "all",
                plan: ""
            };
            accountsState.usersLoaded = false;
            void loadUsers();
        });

        panel.querySelector("[data-users-load-more]")?.addEventListener("click", () => {
            if (accountsState.usersNextCursor) {
                void loadUsers({
                    cursor: accountsState.usersNextCursor,
                    append: true
                });
            }
        });

        panel.querySelectorAll("[data-user-view]").forEach((button) => {
            button.addEventListener("click", () => {
                void loadUserDetail(button.dataset.userView);
            });
        });

        panel.querySelectorAll("[data-user-detail-close]").forEach((button) => {
            button.addEventListener("click", () => {
                accountsState.userDetail = null;
                accountsState.userDetailError = "";
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-entitlement-action]").forEach((button) => {
            button.addEventListener("click", () => {
                openEntitlementAction(button.dataset.entitlementAction, {
                    entitlementId: button.dataset.entitlementId,
                    userEmail: button.dataset.userEmail,
                    userId: button.dataset.userId
                });
            });
        });

        panel.querySelectorAll("[data-user-moderation-note]").forEach((button) => {
            button.addEventListener("click", () => {
                moderationState.modal = {
                    type: "userNote",
                    title: "Add moderation note",
                    description: "This records a safe admin note only. It does not ban or restrict the user.",
                    userEmail: button.dataset.userEmail || "",
                    userId: button.dataset.userId || ""
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-user-feedback-mute]").forEach((button) => {
            button.addEventListener("click", () => {
                moderationState.modal = {
                    type: "feedbackMute",
                    title: "Temporary feedback mute",
                    description: "This limits feedback submissions only; gameplay remains untouched.",
                    userEmail: button.dataset.userEmail || "",
                    sessionId: ""
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });
    }

    function renderAccessPanel(panel, module) {
        const totals = accountsState.overview?.totals || {};
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Access and unlock visibility stays read-only except audited manual support actions.</p>
            </div>
            ${renderAdminNotice()}
            <div class="admin-feedback-summary admin-account-summary">
                ${renderFeedbackSummaryCard("Premium users", accountsState.overview ? formatMetricValue(totals.premiumUsers) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Expired premium", accountsState.overview ? formatMetricValue(totals.expiredPremiumUsers) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Active access", accountsState.overview ? formatMetricValue(totals.activeEntitlements) : accountsState.overviewError ? "Unavailable" : "Loading...")}
                ${renderFeedbackSummaryCard("Expired access", accountsState.overview ? formatMetricValue(totals.expiredEntitlements) : accountsState.overviewError ? "Unavailable" : "Loading...")}
            </div>
            ${renderEntitlementsSection()}
            ${renderOwnedItemsSection()}
            ${renderEntitlementActionModal()}
        `;

        bindAccessPanel(panel);
        bindEntitlementActionModal(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!accountsState.overview && !accountsState.overviewLoading && !accountsState.overviewError) {
            void loadAccountsOverview({ silent: true });
        }
        if (!accountsState.entitlementsLoaded && !accountsState.entitlementsLoading) {
            void loadEntitlements({ silent: true });
        }
        if (!accountsState.ownedItemsLoaded && !accountsState.ownedItemsLoading) {
            void loadOwnedItems({ silent: true });
        }
    }

    function renderEntitlementsSection() {
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading admin-section-heading--actions">
                    <div>
                        <h3>Entitlements</h3>
                        <p>Active, expired, or revoked access records when entitlement collections exist.</p>
                    </div>
                    <button class="premium-primary-button" type="button" data-entitlement-action="grant">${icon("check")}<span>Grant entitlement</span></button>
                </div>
                <form class="admin-feedback-filters admin-entitlements-filters" data-entitlements-filters>
                    <label>
                        <span>Search</span>
                        <input name="search" type="search" value="${escapeHtml(accountsState.entitlementsFilters.search)}" placeholder="email, user, entitlement, source">
                    </label>
                    <label>
                        <span>Status</span>
                        <select name="status">
                            ${ENTITLEMENT_STATUSES.map((status) => `<option value="${status}"${accountsState.entitlementsFilters.status === status ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        <span>Type</span>
                        <input name="type" type="search" value="${escapeHtml(accountsState.entitlementsFilters.type)}" placeholder="premium, pass, item">
                    </label>
                    <div class="admin-feedback-filter-actions">
                        <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                        <button class="premium-ghost-button" type="button" data-entitlements-clear>${icon("close")}<span>Clear</span></button>
                    </div>
                </form>
                ${renderEntitlementsList()}
            </section>
        `;
    }

    function renderEntitlementsList() {
        if (accountsState.entitlementsLoading) {
            return `<article class="admin-placeholder-card"><strong>Loading entitlements...</strong><p>Fetching safe entitlement records.</p></article>`;
        }
        if (accountsState.entitlementsError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load entitlements</strong><p>${escapeHtml(accountsState.entitlementsError)}</p></article>`;
        }
        if (!accountsState.dataConnected || !accountsState.entitlements.length) {
            return `<article class="admin-placeholder-card"><strong>No records connected yet</strong><p>Entitlement records will appear here when a supported collection exists.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-entitlements-table" role="table" aria-label="Entitlements">
                <div class="admin-data-row admin-data-row--head admin-entitlements-row" role="row">
                    <span>User</span>
                    <span>Type</span>
                    <span>Source</span>
                    <span>Status</span>
                    <span>Starts</span>
                    <span>Expires</span>
                    <span>Record</span>
                    <span>Actions</span>
                </div>
                ${accountsState.entitlements.map((item) => `
                    <div class="admin-data-row admin-entitlements-row" role="row">
                        <span>${escapeHtml(shortText(item.email || item.userId || "Unknown", 54))}</span>
                        <span>${escapeHtml(shortText(item.entitlementType || "unknown", 48))}</span>
                        <span>${escapeHtml(titleCase(item.source || "unknown"))}</span>
                        <span>${renderStatusPill(item.status)}</span>
                        <span>${escapeHtml(formatDate(item.startsAt || item.createdAt))}</span>
                        <span>${escapeHtml(item.expiresAt ? formatDate(item.expiresAt) : "No expiry")}</span>
                        <span>${escapeHtml(shortId(item.id))}</span>
                        <span class="admin-feedback-actions-cell">
                            <button type="button" data-entitlement-action="view" data-entitlement-id="${escapeHtml(item.id)}">View</button>
                            <button type="button" data-entitlement-action="extend" data-entitlement-id="${escapeHtml(item.id)}">Extend</button>
                            <button type="button" data-entitlement-action="revoke" data-entitlement-id="${escapeHtml(item.id)}">Revoke</button>
                            <button type="button" data-entitlement-action="note" data-entitlement-id="${escapeHtml(item.id)}">Note</button>
                        </span>
                    </div>
                `).join("")}
            </div>
            ${accountsState.entitlementsNextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-entitlements-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderOwnedItemsSection() {
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading">
                    <h3>Owned Items</h3>
                    <p>Visible when owned-item collections are connected.</p>
                </div>
                ${renderOwnedItemsList()}
            </section>
        `;
    }

    function renderOwnedItemsList() {
        if (accountsState.ownedItemsLoading) {
            return `<article class="admin-placeholder-card"><strong>Loading owned items...</strong><p>Fetching safe owned unlock records.</p></article>`;
        }
        if (accountsState.ownedItemsError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load owned items</strong><p>${escapeHtml(accountsState.ownedItemsError)}</p></article>`;
        }
        if (!accountsState.dataConnected || !accountsState.ownedItems.length) {
            return `<article class="admin-placeholder-card"><strong>No records connected yet</strong><p>Owned item records will appear here when a supported collection exists.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-owned-items-table" role="table" aria-label="Owned items">
                <div class="admin-data-row admin-data-row--head admin-owned-items-row" role="row">
                    <span>User</span>
                    <span>Item</span>
                    <span>Category</span>
                    <span>Source</span>
                    <span>Date</span>
                </div>
                ${accountsState.ownedItems.map((item) => `
                    <div class="admin-data-row admin-owned-items-row" role="row">
                        <span>${escapeHtml(shortText(item.email || item.userId || "Unknown", 54))}</span>
                        <span>${escapeHtml(shortText(item.title || item.itemId || "Owned item", 80))}</span>
                        <span>${escapeHtml(titleCase(item.category || "item"))}</span>
                        <span>${escapeHtml(titleCase(item.source || "unknown"))}</span>
                        <span>${escapeHtml(formatDate(item.createdAt))}</span>
                    </div>
                `).join("")}
            </div>
            ${accountsState.ownedItemsNextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-owned-items-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function bindAccessPanel(panel) {
        const entitlementFilters = panel.querySelector("[data-entitlements-filters]");
        entitlementFilters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(entitlementFilters);
            accountsState.entitlementsFilters = {
                search: String(formData.get("search") || "").trim(),
                status: String(formData.get("status") || "all"),
                type: String(formData.get("type") || "").trim()
            };
            accountsState.entitlementsLoaded = false;
            void loadEntitlements();
        });

        panel.querySelector("[data-entitlements-clear]")?.addEventListener("click", () => {
            accountsState.entitlementsFilters = {
                search: "",
                status: "all",
                type: ""
            };
            accountsState.entitlementsLoaded = false;
            void loadEntitlements();
        });

        panel.querySelector("[data-entitlements-load-more]")?.addEventListener("click", () => {
            if (accountsState.entitlementsNextCursor) {
                void loadEntitlements({
                    cursor: accountsState.entitlementsNextCursor,
                    append: true
                });
            }
        });

        panel.querySelector("[data-owned-items-load-more]")?.addEventListener("click", () => {
            if (accountsState.ownedItemsNextCursor) {
                void loadOwnedItems({
                    cursor: accountsState.ownedItemsNextCursor,
                    append: true
                });
            }
        });

        panel.querySelectorAll("[data-entitlement-action]").forEach((button) => {
            button.addEventListener("click", () => {
                openEntitlementAction(button.dataset.entitlementAction, {
                    entitlementId: button.dataset.entitlementId
                });
            });
        });
    }

    function findEntitlementById(id) {
        const all = [
            ...accountsState.entitlements,
            ...(accountsState.userDetail?.entitlements || [])
        ];
        return all.find((item) => item.id === id) || null;
    }

    function openEntitlementAction(action, context = {}) {
        const entitlement = context.entitlementId ? findEntitlementById(context.entitlementId) : null;
        entitlementActionState.modal = {
            action,
            entitlement,
            userEmail: context.userEmail || accountsState.userDetail?.email || "",
            userId: context.userId || accountsState.userDetail?.id || ""
        };
        entitlementActionState.error = "";
        void loadEntitlementTypes().then(() => renderActivePanel());
        renderActivePanel();
    }

    function renderEntitlementTypeOptions(selected = "") {
        const items = accountsState.entitlementTypes.length
            ? accountsState.entitlementTypes
            : [
                { id: "premium", label: "Premium" },
                { id: "premium_pass", label: "Premium Pass" },
                { id: "monthly_pass", label: "Monthly Pass" },
                { id: "yearly_pass", label: "Yearly Pass" },
                { id: "game_access", label: "Game Access" },
                { id: "catalog_access", label: "Catalog Access" }
            ];
        return items.map((item) => `<option value="${escapeHtml(item.id)}"${selected === item.id ? " selected" : ""}>${escapeHtml(item.label || titleCase(item.id))}</option>`).join("");
    }

    function renderEntitlementActionModal() {
        const modal = entitlementActionState.modal;
        if (!modal) {
            return "";
        }
        const action = modal.action || "view";
        const entitlement = modal.entitlement || {};
        const title = action === "grant"
            ? "Grant entitlement"
            : (action === "extend"
                ? "Extend entitlement"
                : (action === "revoke" ? "Revoke entitlement" : (action === "note" ? "Entitlement note" : "Entitlement detail")));
        const body = action === "grant"
            ? renderGrantEntitlementForm(modal)
            : (action === "extend"
                ? renderExtendEntitlementForm(entitlement)
                : (action === "revoke"
                    ? renderRevokeEntitlementForm(entitlement)
                    : (action === "note" ? renderEntitlementNoteForm(entitlement) : renderEntitlementView(entitlement))));

        return `
            <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
                <button class="admin-feedback-detail-backdrop" type="button" data-entitlement-modal-close aria-label="Close entitlement action"></button>
                <section class="admin-feedback-detail-card admin-entitlement-action-card">
                    <button class="admin-feedback-detail-close" type="button" data-entitlement-modal-close aria-label="Close">X</button>
                    <p class="premium-kicker">Manual Support Action</p>
                    <h3>${escapeHtml(title)}</h3>
                    ${entitlementActionState.error ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Action failed</strong><p>${escapeHtml(entitlementActionState.error)}</p></article>` : ""}
                    ${body}
                </section>
            </div>
        `;
    }

    function renderGrantEntitlementForm(modal) {
        return `
            <form class="admin-feedback-note-form admin-entitlement-action-form" data-entitlement-action-form="grant">
                <label>
                    <span>User email</span>
                    <input name="userEmail" type="email" value="${escapeHtml(modal.userEmail && modal.userEmail !== "Unknown" ? modal.userEmail : "")}" placeholder="player@example.com" required>
                </label>
                <label>
                    <span>User id optional</span>
                    <input name="userId" type="text" value="${escapeHtml(modal.userId || "")}" placeholder="Firebase uid if known">
                </label>
                <label>
                    <span>Entitlement type</span>
                    <select name="entitlementType">${renderEntitlementTypeOptions("premium")}</select>
                </label>
                <label>
                    <span>Plan optional</span>
                    <input name="plan" type="text" maxlength="120" placeholder="support pass">
                </label>
                <label>
                    <span>Product optional</span>
                    <input name="productId" type="text" maxlength="160" placeholder="premium-support">
                </label>
                <label>
                    <span>Duration days</span>
                    <input name="durationDays" type="number" min="1" max="3660" value="30">
                </label>
                <label>
                    <span>Expiry date optional</span>
                    <input name="expiresAt" type="datetime-local">
                </label>
                <label class="admin-form-wide">
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Support correction reason"></textarea>
                </label>
                <label class="admin-confirm-line admin-form-wide">
                    <input name="confirmed" type="checkbox" required>
                    <span>I understand this manually changes premium access and does not create checkout records.</span>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${entitlementActionState.pending ? "disabled" : ""}>${icon("check")}<span>${entitlementActionState.pending ? "Granting..." : "Grant entitlement"}</span></button>
                    <button class="premium-ghost-button" type="button" data-entitlement-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderExtendEntitlementForm(entitlement) {
        return `
            <form class="admin-feedback-note-form admin-entitlement-action-form" data-entitlement-action-form="extend" data-entitlement-id="${escapeHtml(entitlement.id || "")}">
                ${renderEntitlementSummary(entitlement)}
                <label>
                    <span>Current expiry</span>
                    <input type="text" value="${escapeHtml(entitlement.expiresAt ? formatDate(entitlement.expiresAt) : "No expiry")}" disabled>
                </label>
                <label>
                    <span>Duration days</span>
                    <input name="durationDays" type="number" min="1" max="3660" placeholder="30">
                </label>
                <label>
                    <span>New expiry date</span>
                    <input name="expiresAt" type="datetime-local">
                </label>
                <label class="admin-form-wide">
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why this expiry is changing"></textarea>
                </label>
                <label class="admin-confirm-line admin-form-wide">
                    <input name="confirmed" type="checkbox" required>
                    <span>I understand this changes premium expiry.</span>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${entitlementActionState.pending ? "disabled" : ""}>${icon("check")}<span>${entitlementActionState.pending ? "Extending..." : "Extend entitlement"}</span></button>
                    <button class="premium-ghost-button" type="button" data-entitlement-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderRevokeEntitlementForm(entitlement) {
        return `
            <form class="admin-feedback-note-form admin-entitlement-action-form" data-entitlement-action-form="revoke" data-entitlement-id="${escapeHtml(entitlement.id || "")}">
                ${renderEntitlementSummary(entitlement)}
                <label class="admin-form-wide">
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why access is being revoked"></textarea>
                </label>
                <label class="admin-confirm-line admin-form-wide">
                    <input name="confirmed" type="checkbox" required>
                    <span>I understand this removes/revokes access.</span>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${entitlementActionState.pending ? "disabled" : ""}>${icon("check")}<span>${entitlementActionState.pending ? "Revoking..." : "Revoke entitlement"}</span></button>
                    <button class="premium-ghost-button" type="button" data-entitlement-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderEntitlementNoteForm(entitlement) {
        return `
            <form class="admin-feedback-note-form admin-entitlement-action-form" data-entitlement-action-form="note" data-entitlement-id="${escapeHtml(entitlement.id || "")}">
                ${renderEntitlementSummary(entitlement)}
                <label class="admin-form-wide">
                    <span>Admin note</span>
                    <textarea name="adminNote" maxlength="1000">${escapeHtml(entitlement.adminNote || "")}</textarea>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${entitlementActionState.pending ? "disabled" : ""}>${icon("check")}<span>${entitlementActionState.pending ? "Saving..." : "Save note"}</span></button>
                    <button class="premium-ghost-button" type="button" data-entitlement-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderEntitlementView(entitlement) {
        return `
            ${renderEntitlementSummary(entitlement)}
            <dl class="admin-feedback-detail-meta">
                <div><dt>ID</dt><dd>${escapeHtml(entitlement.id || "Unknown")}</dd></div>
                <div><dt>User</dt><dd>${escapeHtml(entitlement.email || entitlement.userId || "Unknown")}</dd></div>
                <div><dt>Created</dt><dd>${escapeHtml(formatDate(entitlement.createdAt))}</dd></div>
                <div><dt>Updated</dt><dd>${escapeHtml(formatDate(entitlement.updatedAt))}</dd></div>
                <div><dt>Granted by</dt><dd>${escapeHtml(entitlement.grantedBy || "Unknown")}</dd></div>
                <div><dt>Revoked</dt><dd>${escapeHtml(entitlement.revokedAt ? `${formatDate(entitlement.revokedAt)} by ${entitlement.revokedBy || "unknown"}` : "No")}</dd></div>
            </dl>
            <div class="admin-feedback-message-full">
                <strong>Admin note</strong>
                <p>${escapeHtml(entitlement.adminNote || "No note.")}</p>
            </div>
            <div class="admin-feedback-detail-actions">
                <button class="premium-ghost-button" type="button" data-entitlement-modal-close>${icon("close")}<span>Close</span></button>
            </div>
        `;
    }

    function renderEntitlementSummary(entitlement) {
        return `
            <div class="admin-feedback-message-full">
                <strong>${escapeHtml(entitlement.entitlementType || "Entitlement")}</strong>
                <p>${escapeHtml(entitlement.email || entitlement.userId || "Unknown user")} - ${escapeHtml(titleCase(entitlement.status || "unknown"))} - ${escapeHtml(entitlement.expiresAt ? `expires ${formatDate(entitlement.expiresAt)}` : "no expiry")}</p>
            </div>
        `;
    }

    function bindEntitlementActionModal(panel) {
        panel.querySelectorAll("[data-entitlement-modal-close]").forEach((button) => {
            button.addEventListener("click", () => {
                entitlementActionState.modal = null;
                entitlementActionState.error = "";
                renderActivePanel();
            });
        });

        panel.querySelector("[data-entitlement-action-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            void submitEntitlementAction(event.currentTarget);
        });
    }

    function formDateToIso(value) {
        const raw = String(value || "").trim();
        if (!raw) {
            return "";
        }
        const date = new Date(raw);
        return Number.isNaN(date.getTime()) ? raw : date.toISOString();
    }

    async function submitEntitlementAction(form) {
        const action = form.dataset.entitlementActionForm;
        const formData = new FormData(form);
        const entitlementId = form.dataset.entitlementId || entitlementActionState.modal?.entitlement?.id || "";
        const payload = {};
        if (action === "grant") {
            payload.userEmail = String(formData.get("userEmail") || "").trim();
            payload.userId = String(formData.get("userId") || "").trim();
            payload.entitlementType = String(formData.get("entitlementType") || "").trim();
            payload.plan = String(formData.get("plan") || "").trim();
            payload.productId = String(formData.get("productId") || "").trim();
            payload.durationDays = String(formData.get("durationDays") || "").trim();
            payload.expiresAt = formDateToIso(formData.get("expiresAt"));
            payload.reason = String(formData.get("reason") || "").trim();
            payload.confirmed = formData.get("confirmed") === "on";
        } else if (action === "extend") {
            payload.durationDays = String(formData.get("durationDays") || "").trim();
            payload.expiresAt = formDateToIso(formData.get("expiresAt"));
            payload.reason = String(formData.get("reason") || "").trim();
            payload.confirmed = formData.get("confirmed") === "on";
        } else if (action === "revoke") {
            payload.reason = String(formData.get("reason") || "").trim();
            payload.confirmed = formData.get("confirmed") === "on";
        } else if (action === "note") {
            payload.adminNote = String(formData.get("adminNote") || "");
        }

        entitlementActionState.pending = true;
        entitlementActionState.error = "";
        renderActivePanel();
        try {
            const path = action === "grant"
                ? "/api/admin/entitlements/grant"
                : `/api/admin/entitlements/${encodeURIComponent(entitlementId)}/${action}`;
            const payloadResult = await adminFetch(path, {
                method: action === "grant" ? "POST" : "PATCH",
                body: JSON.stringify(payload)
            });
            entitlementActionState.modal = null;
            accountsState.actionNotice = {
                type: "success",
                text: `${titleCase(action)} action saved for ${payloadResult.item?.email || payloadResult.item?.userId || "entitlement"}.`
            };
            await refreshAfterEntitlementAction(payloadResult.item);
        } catch (error) {
            entitlementActionState.error = error?.message || "Could not complete entitlement action.";
            renderActivePanel();
        } finally {
            entitlementActionState.pending = false;
            renderActivePanel();
        }
    }

    async function refreshAfterEntitlementAction(item) {
        accountsState.entitlementsLoaded = false;
        await Promise.all([
            loadAccountsOverview({ silent: true }),
            loadEntitlements({ silent: true }),
            auditState.loaded ? loadAuditLogs({ silent: true }) : Promise.resolve()
        ]);
        if (accountsState.userDetail?.id || accountsState.userDetail?.email) {
            await loadUserDetail(accountsState.userDetail.id || accountsState.userDetail.email);
        } else if (item?.email && activeModule === "users") {
            await loadUserAuditHistory({ email: item.email });
        }
    }

    function renderModerationPanel(panel, module) {
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Report triage, temporary feedback limits, user notes, and safe realtime controls.</p>
            </div>
            ${renderAdminNotice()}
            ${renderModerationOverview()}
            ${renderModerationReports()}
            ${renderModerationRecords()}
            ${renderModerationModal()}
            ${renderFeedbackDetail()}
        `;

        bindModerationPanel(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!moderationState.overview && !moderationState.overviewLoading && !moderationState.overviewError) {
            void loadModerationOverview({ silent: true });
        }
        if (!moderationState.reportsLoaded && !moderationState.reportsLoading) {
            void loadModerationReports({ silent: true });
        }
        if (!moderationState.recordsLoaded && !moderationState.recordsLoading) {
            void loadModerationRecords({ silent: true });
        }
    }

    function renderModerationOverview() {
        const totals = moderationState.overview?.totals || {};
        const pending = moderationState.overviewError ? "Unavailable" : "Loading...";
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading admin-section-heading--actions">
                    <div>
                        <h3>Moderation Overview</h3>
                        <p>Temporary and reversible actions only. Every mutation requires reason and audit logging.</p>
                    </div>
                    <button class="premium-ghost-button" type="button" data-moderation-refresh>${icon("radar")}<span>Refresh</span></button>
                </div>
                <div class="admin-feedback-summary">
                    ${renderFeedbackSummaryCard("Open reports", moderationState.overview ? formatNumber(totals.openReports) : pending)}
                    ${renderFeedbackSummaryCard("Spam feedback", moderationState.overview ? formatNumber(totals.spamFeedback) : pending)}
                    ${renderFeedbackSummaryCard("Active restrictions", moderationState.overview ? formatNumber(totals.activeRestrictions) : pending)}
                    ${renderFeedbackSummaryCard("Rooms closed today", moderationState.overview ? formatNumber(totals.roomsClosedToday) : pending)}
                    ${renderFeedbackSummaryCard("Players kicked today", moderationState.overview ? formatNumber(totals.playersKickedToday) : pending)}
                    ${renderFeedbackSummaryCard("Queues cleared today", moderationState.overview ? formatNumber(totals.queueEntriesClearedToday) : pending)}
                </div>
                ${moderationState.overviewError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load moderation overview</strong><p>${escapeHtml(moderationState.overviewError)}</p></article>` : ""}
            </section>
        `;
    }

    function renderModerationReports() {
        if (moderationState.reportsLoading && !moderationState.reports.length) {
            return `<section class="admin-readonly-section"><article class="admin-placeholder-card"><strong>Loading reports...</strong><p>Fetching report and spam feedback.</p></article></section>`;
        }
        if (moderationState.reportsError) {
            return `<section class="admin-readonly-section"><article class="admin-placeholder-card admin-feedback-error"><strong>Could not load reports</strong><p>${escapeHtml(moderationState.reportsError)}</p></article></section>`;
        }
        const rows = moderationState.reports;
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading">
                    <h3>Reports Queue</h3>
                    <p>Feedback reports and spam/moderation-review items.</p>
                </div>
                ${rows.length ? `
                    <div class="admin-feedback-table" role="table" aria-label="Moderation reports">
                        <div class="admin-feedback-row admin-feedback-row--head" role="row">
                            <span>Date</span>
                            <span>Type</span>
                            <span>Game/Page</span>
                            <span>Message</span>
                            <span>User/Session</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        ${rows.map((item) => renderModerationReportRow(item)).join("")}
                    </div>
                ` : `<article class="admin-placeholder-card"><strong>No reports yet</strong><p>Report feedback and spam items will appear here.</p></article>`}
            </section>
        `;
    }

    function renderModerationReportRow(item) {
        const user = item.verifiedUserEmail || item.contactEmail || shortSession(item.anonymousSessionId);
        const game = item.gameTitle || item.gameSlug || item.path || "Unknown";
        return `
            <div class="admin-feedback-row" role="row">
                <span>${escapeHtml(formatDate(item.createdAt))}</span>
                <span>${escapeHtml(titleCase(item.type || "report"))}</span>
                <span>${escapeHtml(shortText(game, 72))}</span>
                <span>${escapeHtml(shortText(item.message, 110))}</span>
                <span>${escapeHtml(shortText(user, 54))}</span>
                <span>${renderStatusPill(item.status || "open")}</span>
                <span class="admin-feedback-actions-cell">
                    <button type="button" data-moderation-feedback-view="${escapeHtml(item.id)}">View</button>
                    <button type="button" data-moderation-feedback-mark="moderation_review" data-feedback-id="${escapeHtml(item.id)}">Review</button>
                    <button type="button" data-moderation-feedback-mark="spam" data-feedback-id="${escapeHtml(item.id)}">Spam</button>
                    <button type="button" data-moderation-feedback-mark="resolved" data-feedback-id="${escapeHtml(item.id)}">Resolve</button>
                    <button type="button" data-moderation-feedback-mark="ignored" data-feedback-id="${escapeHtml(item.id)}">Ignore</button>
                    <button type="button" data-moderation-feedback-mute="${escapeHtml(item.id)}">Mute</button>
                </span>
            </div>
        `;
    }

    function renderModerationRecords() {
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading">
                    <h3>Moderation Records</h3>
                    <p>Paginated moderation action history. Full audit details remain in Audit Logs.</p>
                </div>
                <form class="admin-feedback-filters" data-moderation-records-filters>
                    <label>
                        <span>Action</span>
                        <select name="action">
                            ${MODERATION_ACTIONS.map((action) => `<option value="${escapeHtml(action)}"${moderationState.recordsFilters.action === action ? " selected" : ""}>${escapeHtml(action ? titleCase(action) : "All")}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        <span>Target</span>
                        <select name="targetType">
                            ${MODERATION_TARGET_TYPES.map((type) => `<option value="${escapeHtml(type)}"${moderationState.recordsFilters.targetType === type ? " selected" : ""}>${escapeHtml(type ? titleCase(type) : "All")}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        <span>Status</span>
                        <input name="status" type="search" value="${escapeHtml(moderationState.recordsFilters.status)}" placeholder="active, spam, resolved">
                    </label>
                    <label>
                        <span>Search</span>
                        <input name="search" type="search" value="${escapeHtml(moderationState.recordsFilters.search)}" placeholder="email, session, room, reason">
                    </label>
                    <div class="admin-feedback-filter-actions">
                        <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                        <button class="premium-ghost-button" type="button" data-moderation-records-clear>${icon("close")}<span>Clear</span></button>
                    </div>
                </form>
                ${renderModerationRecordList()}
            </section>
        `;
    }

    function renderModerationRecordList() {
        if (moderationState.recordsLoading) {
            return `<article class="admin-placeholder-card"><strong>Loading moderation records...</strong><p>Fetching recent moderation actions.</p></article>`;
        }
        if (moderationState.recordsError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load moderation records</strong><p>${escapeHtml(moderationState.recordsError)}</p></article>`;
        }
        if (!moderationState.records.length) {
            return `<article class="admin-placeholder-card"><strong>No moderation records yet</strong><p>Moderation actions will appear here.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-audit-table" role="table" aria-label="Moderation records">
                <div class="admin-data-row admin-data-row--head admin-audit-row" role="row">
                    <span>Date</span>
                    <span>Action</span>
                    <span>Target</span>
                    <span>Status</span>
                    <span>Reason</span>
                    <span>Expires</span>
                </div>
                ${moderationState.records.map((item) => `
                    <div class="admin-data-row admin-audit-row" role="row">
                        <span>${escapeHtml(formatDate(item.createdAt))}</span>
                        <span>${renderStatusPill(item.action || "action")}</span>
                        <span>${escapeHtml(shortText(item.targetEmail || item.targetId || item.targetType || "unknown", 64))}</span>
                        <span>${renderStatusPill(item.status || "open")}</span>
                        <span>${escapeHtml(shortText(item.reason || "No reason", 100))}</span>
                        <span>${escapeHtml(item.expiresAt ? formatDate(item.expiresAt) : "No expiry")}</span>
                    </div>
                `).join("")}
            </div>
            ${moderationState.recordsNextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-moderation-records-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderModerationModal() {
        const modal = moderationState.modal;
        if (!modal) {
            return "";
        }
        const title = modal.title || "Moderation action";
        const description = modal.description || "Confirm this temporary moderation action.";
        return `
            <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
                <button class="admin-feedback-detail-backdrop" type="button" data-moderation-modal-close aria-label="Close moderation action"></button>
                <section class="admin-feedback-detail-card">
                    <button class="admin-feedback-detail-close" type="button" data-moderation-modal-close aria-label="Close">X</button>
                    <p class="premium-kicker">Moderation</p>
                    <h3>${escapeHtml(title)}</h3>
                    <p>${escapeHtml(description)}</p>
                    ${moderationState.error ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Action failed</strong><p>${escapeHtml(moderationState.error)}</p></article>` : ""}
                    ${renderModerationModalForm(modal)}
                </section>
            </div>
        `;
    }

    function renderModerationModalForm(modal) {
        if (modal.type === "feedbackMute") {
            return renderFeedbackMuteForm(modal);
        }
        if (modal.type === "userNote") {
            return renderUserNoteForm(modal);
        }
        if (modal.type === "roomClose" || modal.type === "playerKick" || modal.type === "queueRemove") {
            return renderRealtimeModerationForm(modal);
        }
        return renderFeedbackMarkForm(modal);
    }

    function renderFeedbackMarkForm(modal) {
        return `
            <form class="admin-feedback-note-form" data-moderation-action-form="${escapeHtml(modal.type || "feedbackMark")}">
                <input type="hidden" name="feedbackId" value="${escapeHtml(modal.feedbackId || "")}">
                <input type="hidden" name="status" value="${escapeHtml(modal.status || "")}">
                <label>
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why this report is being marked"></textarea>
                </label>
                <label>
                    <span>Admin note</span>
                    <textarea name="adminNote" maxlength="1000" placeholder="Optional note"></textarea>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${moderationState.pending ? "disabled" : ""}>${icon("check")}<span>${moderationState.pending ? "Saving..." : "Apply"}</span></button>
                    <button class="premium-ghost-button" type="button" data-moderation-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderFeedbackMuteForm(modal) {
        return `
            <form class="admin-feedback-note-form" data-moderation-action-form="feedbackMute">
                <input type="hidden" name="userEmail" value="${escapeHtml(modal.userEmail || "")}">
                <input type="hidden" name="sessionId" value="${escapeHtml(modal.sessionId || "")}">
                <label>
                    <span>Duration minutes</span>
                    <input name="durationMinutes" type="number" min="10" max="1440" value="60" required>
                </label>
                <label>
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why feedback is being temporarily limited"></textarea>
                </label>
                <label>
                    <input name="confirmed" type="checkbox" required>
                    <span>I understand this only limits feedback submissions temporarily.</span>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${moderationState.pending ? "disabled" : ""}>${icon("check")}<span>${moderationState.pending ? "Saving..." : "Mute feedback"}</span></button>
                    <button class="premium-ghost-button" type="button" data-moderation-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderUserNoteForm(modal) {
        return `
            <form class="admin-feedback-note-form" data-moderation-action-form="userNote">
                <input type="hidden" name="userEmail" value="${escapeHtml(modal.userEmail || "")}">
                <input type="hidden" name="userId" value="${escapeHtml(modal.userId || "")}">
                <input type="hidden" name="sessionId" value="${escapeHtml(modal.sessionId || "")}">
                <label>
                    <span>Moderation note</span>
                    <textarea name="note" maxlength="1000" required placeholder="Note for future support review"></textarea>
                </label>
                <label>
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why this note is being added"></textarea>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${moderationState.pending ? "disabled" : ""}>${icon("check")}<span>${moderationState.pending ? "Saving..." : "Save note"}</span></button>
                    <button class="premium-ghost-button" type="button" data-moderation-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function renderRealtimeModerationForm(modal) {
        const players = Array.isArray(modal.players) ? modal.players.filter((player) => player.supportsKick) : [];
        return `
            <form class="admin-feedback-note-form" data-moderation-action-form="${escapeHtml(modal.type)}">
                <input type="hidden" name="roomRef" value="${escapeHtml(modal.roomRef || "")}">
                <input type="hidden" name="queueEntryRef" value="${escapeHtml(modal.queueEntryRef || "")}">
                ${modal.type === "playerKick" ? `
                    <label>
                        <span>Player</span>
                        <select name="playerRef" required>
                            ${players.map((player) => `<option value="${escapeHtml(player.playerRef)}">${escapeHtml(player.name || player.playerIdShort || "Player")}</option>`).join("")}
                        </select>
                    </label>
                ` : ""}
                <label>
                    <span>Reason</span>
                    <textarea name="reason" minlength="5" maxlength="500" required placeholder="Why this realtime control is needed"></textarea>
                </label>
                <label>
                    <input name="confirmed" type="checkbox" required>
                    <span>I understand this affects a live realtime session.</span>
                </label>
                <div class="admin-feedback-detail-actions">
                    <button class="premium-primary-button" type="submit" ${moderationState.pending ? "disabled" : ""}>${icon("check")}<span>${moderationState.pending ? "Saving..." : "Confirm"}</span></button>
                    <button class="premium-ghost-button" type="button" data-moderation-modal-close>${icon("close")}<span>Cancel</span></button>
                </div>
            </form>
        `;
    }

    function bindModerationPanel(panel) {
        panel.querySelector("[data-moderation-refresh]")?.addEventListener("click", () => {
            void Promise.all([loadModerationOverview(), loadModerationReports(), loadModerationRecords({ silent: true })]);
        });
        panel.querySelectorAll("[data-moderation-feedback-view]").forEach((button) => {
            button.addEventListener("click", () => {
                feedbackState.detail = moderationState.reports.find((item) => item.id === button.dataset.moderationFeedbackView) || null;
                renderActivePanel();
            });
        });
        panel.querySelectorAll("[data-moderation-feedback-mark]").forEach((button) => {
            button.addEventListener("click", () => {
                const item = moderationState.reports.find((entry) => entry.id === button.dataset.feedbackId);
                moderationState.modal = {
                    type: "feedbackMark",
                    title: `Mark ${titleCase(button.dataset.moderationFeedbackMark)}`,
                    description: item ? shortText(item.message, 160) : "Update report moderation status.",
                    feedbackId: button.dataset.feedbackId,
                    status: button.dataset.moderationFeedbackMark
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });
        panel.querySelectorAll("[data-moderation-feedback-mute]").forEach((button) => {
            button.addEventListener("click", () => {
                const item = moderationState.reports.find((entry) => entry.id === button.dataset.moderationFeedbackMute);
                moderationState.modal = {
                    type: "feedbackMute",
                    title: "Temporary feedback mute",
                    description: "This limits feedback submissions only; gameplay remains untouched.",
                    userEmail: item?.verifiedUserEmail || "",
                    sessionId: item?.anonymousSessionId || ""
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });
        const filters = panel.querySelector("[data-moderation-records-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            moderationState.recordsFilters = {
                targetType: String(formData.get("targetType") || ""),
                action: String(formData.get("action") || ""),
                status: String(formData.get("status") || "").trim(),
                search: String(formData.get("search") || "").trim()
            };
            moderationState.recordsLoaded = false;
            void loadModerationRecords();
        });
        panel.querySelector("[data-moderation-records-clear]")?.addEventListener("click", () => {
            moderationState.recordsFilters = {
                targetType: "",
                action: "",
                status: "",
                search: ""
            };
            moderationState.recordsLoaded = false;
            void loadModerationRecords();
        });
        panel.querySelector("[data-moderation-records-load-more]")?.addEventListener("click", () => {
            if (moderationState.recordsNextCursor) {
                void loadModerationRecords({
                    cursor: moderationState.recordsNextCursor,
                    append: true
                });
            }
        });
        bindModerationModal(panel);
    }

    function bindModerationModal(panel) {
        panel.querySelectorAll("[data-moderation-modal-close]").forEach((button) => {
            button.addEventListener("click", () => {
                moderationState.modal = null;
                moderationState.error = "";
                renderActivePanel();
            });
        });
        panel.querySelector("[data-moderation-action-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            void submitModerationAction(event.currentTarget);
        });
        panel.querySelectorAll("[data-feedback-detail-close]").forEach((button) => {
            button.addEventListener("click", () => {
                feedbackState.detail = null;
                renderActivePanel();
            });
        });
        panel.querySelector("[data-feedback-note-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            void updateFeedback(form.dataset.feedbackId, {
                status: formData.get("status"),
                adminNote: formData.get("adminNote")
            });
        });
    }

    async function submitModerationAction(form) {
        const action = form.dataset.moderationActionForm;
        const formData = new FormData(form);
        let path = "";
        let method = "POST";
        let payload = {};
        if (action === "feedbackMark") {
            const feedbackId = String(formData.get("feedbackId") || "");
            path = `/api/admin/moderation/feedback/${encodeURIComponent(feedbackId)}/mark`;
            payload = {
                status: formData.get("status"),
                reason: formData.get("reason"),
                adminNote: formData.get("adminNote")
            };
        } else if (action === "feedbackMute") {
            path = "/api/admin/moderation/restrictions/feedback-mute";
            payload = {
                userEmail: formData.get("userEmail"),
                sessionId: formData.get("sessionId"),
                durationMinutes: formData.get("durationMinutes"),
                reason: formData.get("reason"),
                confirmed: formData.get("confirmed") === "on"
            };
        } else if (action === "userNote") {
            path = "/api/admin/moderation/user-note";
            payload = {
                userEmail: formData.get("userEmail"),
                userId: formData.get("userId"),
                sessionId: formData.get("sessionId"),
                note: formData.get("note"),
                reason: formData.get("reason")
            };
        } else if (action === "roomClose") {
            const roomRef = String(formData.get("roomRef") || "");
            path = `/api/admin/realtime/rooms/${encodeURIComponent(roomRef)}/close`;
            payload = {
                reason: formData.get("reason"),
                confirmed: formData.get("confirmed") === "on",
                notifyPlayers: true
            };
        } else if (action === "playerKick") {
            const roomRef = String(formData.get("roomRef") || "");
            path = `/api/admin/realtime/rooms/${encodeURIComponent(roomRef)}/kick-player`;
            payload = {
                playerRef: formData.get("playerRef"),
                reason: formData.get("reason"),
                confirmed: formData.get("confirmed") === "on",
                notifyPlayer: true
            };
        } else if (action === "queueRemove") {
            path = "/api/admin/realtime/queues/remove-entry";
            payload = {
                queueEntryRef: formData.get("queueEntryRef"),
                reason: formData.get("reason"),
                confirmed: formData.get("confirmed") === "on"
            };
        }
        if (!path) {
            return;
        }
        moderationState.pending = true;
        moderationState.error = "";
        renderActivePanel();
        try {
            await adminFetch(path, {
                method,
                body: JSON.stringify(payload)
            });
            moderationState.modal = null;
            moderationState.pending = false;
            accountsState.actionNotice = {
                type: "success",
                text: "Moderation action completed."
            };
            await refreshAfterModerationAction(action);
        } catch (error) {
            moderationState.pending = false;
            moderationState.error = error?.message || "Moderation action failed.";
            renderActivePanel();
        }
    }

    async function refreshAfterModerationAction(action) {
        await Promise.all([
            loadModerationOverview({ silent: true }),
            loadModerationRecords({ silent: true }),
            loadModerationReports({ silent: true }),
            auditState.loaded ? loadAuditLogs({ silent: true }) : Promise.resolve(),
            action === "roomClose" || action === "playerKick" || action === "queueRemove" ? refreshRealtimeMonitoring({ silent: true }) : Promise.resolve()
        ]);
        if (accountsState.userDetail?.id || accountsState.userDetail?.email) {
            await loadUserModerationHistory({
                email: accountsState.userDetail.email,
                id: accountsState.userDetail.id
            });
        }
        renderActivePanel();
    }

    function renderSystemPanel(panel, module) {
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Server health, storage readiness, websocket availability, and safe runtime logs.</p>
            </div>
            ${renderAdminNotice()}
            ${renderSystemHealthSection()}
            ${renderSystemLogsSection()}
        `;

        bindSystemPanel(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!systemState.health && !systemState.healthLoading && !systemState.healthError) {
            void loadSystemHealth({ silent: true });
        }
        if (!systemState.logsLoaded && !systemState.logsLoading) {
            void loadSystemLogs({ silent: true });
        }
    }

    function renderRealtimePanel(panel, module) {
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Live rooms, sockets, matchmaking queues, and safe adapter-gated moderation controls.</p>
            </div>
            ${renderAdminNotice()}
            ${renderRealtimeSection()}
            ${renderModerationModal()}
        `;

        bindSystemPanel(panel);
        bindModerationModal(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!realtimeState.overview && !realtimeState.overviewLoading && !realtimeState.overviewError) {
            void loadRealtimeOverview({ silent: true });
        }
        if (!realtimeState.roomsLoaded && !realtimeState.roomsLoading) {
            void loadRealtimeRooms({ silent: true });
        }
        if (!realtimeState.queuesLoaded && !realtimeState.queuesLoading) {
            void loadRealtimeQueues({ silent: true });
        }
    }

    function renderAuditPanel(panel, module) {
        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>Paginated support-action history for manual access changes and feedback status updates.</p>
            </div>
            ${renderAdminNotice()}
            ${renderAuditSection()}
            ${renderAuditDetail()}
        `;

        bindSystemPanel(panel);
        bindAdminNotice(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!auditState.loaded && !auditState.loading) {
            void loadAuditLogs({ silent: true });
        }
    }

    function renderAuditSection() {
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading">
                    <h3>Admin Audit Logs</h3>
                    <p>Paginated support-action history for manual entitlement changes and feedback status updates.</p>
                </div>
            <form class="admin-feedback-filters admin-audit-filters" data-audit-filters>
                <label>
                    <span>Action</span>
                    <select name="action">
                        ${AUDIT_ACTIONS.map((action) => `<option value="${escapeHtml(action)}"${auditState.filters.action === action ? " selected" : ""}>${escapeHtml(action ? titleCase(action) : "All")}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Target type</span>
                    <select name="targetType">
                        ${AUDIT_TARGET_TYPES.map((type) => `<option value="${escapeHtml(type)}"${auditState.filters.targetType === type ? " selected" : ""}>${escapeHtml(type ? titleCase(type) : "All")}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Admin email</span>
                    <input name="adminEmail" type="search" value="${escapeHtml(auditState.filters.adminEmail)}" placeholder="admin email">
                </label>
                <label>
                    <span>Target search</span>
                    <input name="targetEmail" type="search" value="${escapeHtml(auditState.filters.targetEmail)}" placeholder="user email or id">
                </label>
                <div class="admin-feedback-filter-actions">
                    <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                    <button class="premium-ghost-button" type="button" data-audit-clear>${icon("close")}<span>Clear</span></button>
                </div>
            </form>
            ${renderAuditLogList()}
            </section>
        `;
    }

    function renderSystemHealthSection() {
        const health = systemState.health;
        const memory = health?.memory || {};
        const storage = health?.storage || {};
        return `
            <section class="admin-readonly-section admin-system-health-section">
                <div class="admin-section-heading admin-section-heading--actions">
                    <div>
                        <h3>Health</h3>
                        <p>Basic process, storage, and websocket readiness. Values are admin-only and do not expose env secrets.</p>
                    </div>
                    <button class="premium-ghost-button" type="button" data-system-refresh>${icon("radar")}<span>Refresh</span></button>
                </div>
                <div class="admin-feedback-summary admin-system-summary">
                    ${renderFeedbackSummaryCard("Status", health ? titleCase(health.status || "unknown") : systemState.healthError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Uptime", health ? formatDuration(health.uptimeSeconds) : systemState.healthError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Memory", health ? formatBytes(memory.heapUsed) : systemState.healthError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Sockets", health ? formatNumber(health.websocket?.activeSockets) : systemState.healthError ? "Unavailable" : "Loading...")}
                </div>
                ${systemState.healthError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load health</strong><p>${escapeHtml(systemState.healthError)}</p></article>` : ""}
                ${health ? `
                    <div class="admin-analytics-grid admin-health-grid">
                        <article class="admin-analytics-card">
                            <h3>Runtime</h3>
                            <p><strong>Node:</strong> ${escapeHtml(health.nodeVersion || "unknown")}</p>
                            <p><strong>Environment:</strong> ${escapeHtml(health.environment || "unknown")}</p>
                            <p><strong>Server time:</strong> ${escapeHtml(formatDate(health.serverTime))}</p>
                        </article>
                        <article class="admin-analytics-card">
                            <h3>Storage</h3>
                            <p><strong>Firebase configured:</strong> ${escapeHtml(storage.firebaseConfigured ? "Yes" : "No")}</p>
                            <p><strong>Local fallback:</strong> ${escapeHtml(storage.localFallbackActive ? "Active" : "Inactive")}</p>
                            <p><strong>Websocket:</strong> ${escapeHtml(health.websocket?.enabled ? "Enabled" : "Unavailable")}</p>
                        </article>
                        <article class="admin-analytics-card">
                            <h3>Checks</h3>
                            ${(health.checks || []).map((check) => `
                                <div class="admin-health-check">
                                    ${renderStatusPill(check.status || "unknown")}
                                    <span>${escapeHtml(check.name || "check")}</span>
                                    <small>${escapeHtml(check.message || "")}</small>
                                </div>
                            `).join("") || "<p>No checks returned.</p>"}
                        </article>
                    </div>
                ` : ""}
            </section>
        `;
    }

    function renderRealtimeSection() {
        const overview = realtimeState.overview;
        const totals = overview?.totals || {};
        return `
            <section class="admin-readonly-section admin-realtime-section">
                <div class="admin-section-heading admin-section-heading--actions">
                    <div>
                        <h3>Realtime</h3>
                        <p>Safe room, socket, and matchmaking snapshots. No raw socket ids, IPs, or tokens are shown.</p>
                    </div>
                    <button class="premium-ghost-button" type="button" data-realtime-refresh>${icon("radar")}<span>Refresh rooms</span></button>
                </div>
                <div class="admin-feedback-summary admin-realtime-summary">
                    ${renderFeedbackSummaryCard("Active sockets", overview ? formatNumber(totals.activeSockets) : realtimeState.overviewError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Active rooms", overview ? formatNumber(totals.activeRooms) : realtimeState.overviewError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Waiting", overview ? formatNumber(totals.matchmakingWaiting) : realtimeState.overviewError ? "Unavailable" : "Loading...")}
                    ${renderFeedbackSummaryCard("Online games", overview ? formatNumber(totals.gamesWithActiveRooms) : realtimeState.overviewError ? "Unavailable" : "Loading...")}
                </div>
                ${realtimeState.overviewError ? `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load realtime overview</strong><p>${escapeHtml(realtimeState.overviewError)}</p></article>` : ""}
                ${renderRealtimeByGame()}
                ${renderRealtimeRooms()}
                ${renderRealtimeQueues()}
            </section>
        `;
    }

    function renderRealtimeByGame() {
        const rows = realtimeState.overview?.byGame || [];
        if (realtimeState.overviewLoading && !rows.length) {
            return `<article class="admin-placeholder-card"><strong>Loading realtime games...</strong><p>Fetching active room totals.</p></article>`;
        }
        if (!rows.length) {
            return `<article class="admin-placeholder-card"><strong>No active online games</strong><p>Realtime game activity will appear here when players join rooms or queues.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-realtime-table" role="table" aria-label="Realtime by game">
                <div class="admin-data-row admin-data-row--head admin-realtime-row" role="row">
                    <span>Game</span>
                    <span>Rooms</span>
                    <span>Players</span>
                    <span>Waiting</span>
                    <span>Public</span>
                    <span>Private</span>
                </div>
                ${rows.map((game) => `
                    <div class="admin-data-row admin-realtime-row" role="row">
                        <span>${escapeHtml(game.gameTitle || game.gameSlug)}</span>
                        <span>${escapeHtml(formatNumber(game.activeRooms))}</span>
                        <span>${escapeHtml(formatNumber(game.activePlayers))}</span>
                        <span>${escapeHtml(formatNumber(game.waitingInQueue))}</span>
                        <span>${escapeHtml(formatNumber(game.publicRooms))}</span>
                        <span>${escapeHtml(formatNumber(game.privateRooms))}</span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderRealtimeRooms() {
        if (realtimeState.roomsLoading && !realtimeState.rooms.length) {
            return `<article class="admin-placeholder-card"><strong>Loading active rooms...</strong><p>Reading live room snapshots.</p></article>`;
        }
        if (realtimeState.roomsError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load active rooms</strong><p>${escapeHtml(realtimeState.roomsError)}</p></article>`;
        }
        if (!realtimeState.rooms.length) {
            return `<article class="admin-placeholder-card"><strong>No active rooms</strong><p>Rooms will appear here when online play starts.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-rooms-table" role="table" aria-label="Active realtime rooms">
                <div class="admin-data-row admin-room-row admin-data-row--head" role="row">
                    <span>Room</span>
                    <span>Game</span>
                    <span>Type</span>
                    <span>Mode</span>
                    <span>Players</span>
                    <span>Age</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>
                ${realtimeState.rooms.map((room) => `
                    <div class="admin-data-row admin-room-row" role="row">
                        <span>${escapeHtml(room.roomIdShort || "unknown")}</span>
                        <span>${escapeHtml(room.gameTitle || room.gameSlug || "Unknown")}</span>
                        <span>${renderStatusPill(room.type || "unknown")}</span>
                        <span>${escapeHtml(room.mode || "online")}</span>
                        <span>${escapeHtml(`${formatNumber(room.playerCount)}${room.maxPlayers ? ` / ${formatNumber(room.maxPlayers)}` : ""}`)}</span>
                        <span>${escapeHtml(room.ageSeconds === null || room.ageSeconds === undefined ? "Unknown" : formatDuration(room.ageSeconds))}<small>${escapeHtml(room.lastActivityAt ? `Last ${formatDate(room.lastActivityAt)}` : "Last activity unknown")}</small></span>
                        <span>${renderStatusPill(room.status || "unknown")}</span>
                        <span class="admin-feedback-actions-cell">
                            ${room.supportsClose ? `<button type="button" data-room-close="${escapeHtml(room.controlRef)}">Close</button>` : ""}
                            ${room.supportsKick ? `<button type="button" data-room-kick="${escapeHtml(room.controlRef)}">Kick</button>` : ""}
                            ${!room.supportsClose && !room.supportsKick ? "<small>Read-only</small>" : ""}
                        </span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderRealtimeQueues() {
        if (realtimeState.queuesLoading && !realtimeState.queues.length) {
            return `<article class="admin-placeholder-card"><strong>Loading queues...</strong><p>Reading matchmaking queues.</p></article>`;
        }
        if (realtimeState.queuesError) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load queues</strong><p>${escapeHtml(realtimeState.queuesError)}</p></article>`;
        }
        if (!realtimeState.queues.length) {
            return `<article class="admin-placeholder-card"><strong>No waiting queues</strong><p>Matchmaking queues will appear here when players are searching.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-queues-table" role="table" aria-label="Matchmaking queues">
                <div class="admin-data-row admin-queue-row admin-data-row--head" role="row">
                    <span>Game</span>
                    <span>Mode</span>
                    <span>Waiting</span>
                    <span>Oldest wait</span>
                    <span>Bot fill</span>
                    <span>Match size</span>
                    <span>Actions</span>
                </div>
                ${realtimeState.queues.map((queue) => `
                    <div class="admin-data-row admin-queue-row" role="row">
                        <span>${escapeHtml(queue.gameTitle || queue.gameSlug || "Unknown")}</span>
                        <span>${escapeHtml(queue.mode || "public")}</span>
                        <span>${escapeHtml(formatNumber(queue.waitingCount))}</span>
                        <span>${escapeHtml(queue.oldestWaitingSeconds === null || queue.oldestWaitingSeconds === undefined ? "Unknown" : formatDuration(queue.oldestWaitingSeconds))}</span>
                        <span>${escapeHtml(queue.botFillEnabled ? "Enabled" : "Off")}</span>
                        <span>${escapeHtml(queue.estimatedMatchSize ? formatNumber(queue.estimatedMatchSize) : "Unknown")}</span>
                        <span class="admin-feedback-actions-cell">
                            ${renderQueueControlButtons(queue)}
                        </span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderQueueControlButtons(queue) {
        const entries = Array.isArray(queue.entries) ? queue.entries.filter((entry) => entry.supportsRemove) : [];
        if (!entries.length) {
            return "<small>Read-only</small>";
        }
        return entries.slice(0, 3).map((entry) => `
            <button type="button" data-queue-remove="${escapeHtml(entry.queueEntryRef)}">${escapeHtml(shortText(entry.label || entry.queueEntryIdShort || "Clear", 18))}</button>
        `).join("");
    }

    function renderSystemLogsSection() {
        const logs = systemState.logs;
        if (systemState.logsLoading && !logs) {
            return `<section class="admin-readonly-section"><article class="admin-placeholder-card"><strong>Loading logs...</strong><p>Checking for a safe in-memory log buffer.</p></article></section>`;
        }
        if (systemState.logsError) {
            return `<section class="admin-readonly-section"><article class="admin-placeholder-card admin-feedback-error"><strong>Could not load logs</strong><p>${escapeHtml(systemState.logsError)}</p></article></section>`;
        }
        if (!logs?.connected || !Array.isArray(logs.items) || !logs.items.length) {
            return `
                <section class="admin-readonly-section">
                    <div class="admin-section-heading">
                        <h3>Logs</h3>
                        <p>${escapeHtml(logs?.message || "Log buffer not connected yet.")}</p>
                    </div>
                    <article class="admin-placeholder-card"><strong>No safe log buffer</strong><p>Server log file reading is intentionally not enabled in Phase 6.</p></article>
                </section>
            `;
        }
        return `
            <section class="admin-readonly-section">
                <div class="admin-section-heading">
                    <h3>Logs</h3>
                    <p>Recent safe server messages.</p>
                </div>
                <div class="admin-mini-list">
                    ${logs.items.map((item) => `<p>${escapeHtml(JSON.stringify(item))}</p>`).join("")}
                </div>
            </section>
        `;
    }

    function renderAuditLogList() {
        if (auditState.loading) {
            return `<article class="admin-placeholder-card"><strong>Loading audit logs...</strong><p>Fetching recent admin support actions.</p></article>`;
        }
        if (auditState.error) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load audit logs</strong><p>${escapeHtml(auditState.error)}</p></article>`;
        }
        if (!auditState.items.length) {
            return `<article class="admin-placeholder-card"><strong>No audit logs yet</strong><p>Admin write actions will appear here.</p></article>`;
        }
        return `
            <div class="admin-data-table admin-audit-table" role="table" aria-label="Admin audit logs">
                <div class="admin-data-row admin-data-row--head admin-audit-row" role="row">
                    <span>Date</span>
                    <span>Action</span>
                    <span>Admin</span>
                    <span>Target</span>
                    <span>Reason</span>
                    <span>Action</span>
                </div>
                ${auditState.items.map((item) => `
                    <div class="admin-data-row admin-audit-row" role="row">
                        <span>${escapeHtml(formatDate(item.createdAt))}</span>
                        <span>${renderStatusPill(item.action || "action")}</span>
                        <span>${escapeHtml(shortText(item.adminEmail || "unknown", 54))}</span>
                        <span>${escapeHtml(shortText(item.targetEmail || item.targetId || item.targetType || "unknown", 64))}</span>
                        <span>${escapeHtml(shortText(item.reason || "No reason", 100))}</span>
                        <span class="admin-feedback-actions-cell"><button type="button" data-audit-view="${escapeHtml(item.id)}">View</button></span>
                    </div>
                `).join("")}
            </div>
            ${auditState.nextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-audit-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderAuditDetail() {
        const item = auditState.detail;
        if (!item) {
            return "";
        }
        return `
            <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="Audit log detail">
                <button class="admin-feedback-detail-backdrop" type="button" data-audit-detail-close aria-label="Close audit detail"></button>
                <section class="admin-feedback-detail-card admin-audit-detail-card">
                    <button class="admin-feedback-detail-close" type="button" data-audit-detail-close aria-label="Close">X</button>
                    <p class="premium-kicker">${escapeHtml(item.action || "Admin action")}</p>
                    <h3>${escapeHtml(item.targetEmail || item.targetId || "Audit detail")}</h3>
                    <dl class="admin-feedback-detail-meta">
                        <div><dt>Admin</dt><dd>${escapeHtml(item.adminEmail || "unknown")}</dd></div>
                        <div><dt>Target type</dt><dd>${escapeHtml(item.targetType || "unknown")}</dd></div>
                        <div><dt>Target id</dt><dd>${escapeHtml(item.targetId || "unknown")}</dd></div>
                        <div><dt>Created</dt><dd>${escapeHtml(formatDate(item.createdAt))}</dd></div>
                        <div><dt>Path</dt><dd>${escapeHtml(item.requestMeta?.path || "unknown")}</dd></div>
                        <div><dt>IP hash</dt><dd>${escapeHtml(shortId(item.requestMeta?.ipHash || ""))}</dd></div>
                    </dl>
                    <div class="admin-feedback-message-full">
                        <strong>Reason</strong>
                        <p>${escapeHtml(item.reason || "No reason recorded.")}</p>
                    </div>
                    <div class="admin-audit-json-grid">
                        ${renderJsonBlock("Before", item.before)}
                        ${renderJsonBlock("After", item.after)}
                    </div>
                    <div class="admin-feedback-detail-actions">
                        <button class="premium-ghost-button" type="button" data-audit-detail-close>${icon("close")}<span>Close</span></button>
                    </div>
                </section>
            </div>
        `;
    }

    function renderJsonBlock(title, value) {
        return `
            <div class="admin-feedback-message-full">
                <strong>${escapeHtml(title)}</strong>
                <pre class="admin-json-block">${escapeHtml(JSON.stringify(value || null, null, 2))}</pre>
            </div>
        `;
    }

    function bindSystemPanel(panel) {
        panel.querySelector("[data-system-refresh]")?.addEventListener("click", () => {
            void Promise.all([
                loadSystemHealth(),
                loadSystemLogs()
            ]);
        });

        panel.querySelector("[data-realtime-refresh]")?.addEventListener("click", () => {
            void refreshRealtimeMonitoring();
        });

        panel.querySelectorAll("[data-room-close]").forEach((button) => {
            button.addEventListener("click", () => {
                const room = realtimeState.rooms.find((item) => item.controlRef === button.dataset.roomClose);
                moderationState.modal = {
                    type: "roomClose",
                    title: "Close realtime room",
                    description: room ? `${room.gameTitle || room.gameSlug} / ${room.roomIdShort}` : "Close this realtime room.",
                    roomRef: button.dataset.roomClose
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-room-kick]").forEach((button) => {
            button.addEventListener("click", () => {
                const room = realtimeState.rooms.find((item) => item.controlRef === button.dataset.roomKick);
                moderationState.modal = {
                    type: "playerKick",
                    title: "Kick player from room",
                    description: room ? `${room.gameTitle || room.gameSlug} / ${room.roomIdShort}` : "Remove a player from this room.",
                    roomRef: button.dataset.roomKick,
                    players: room?.players || []
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-queue-remove]").forEach((button) => {
            button.addEventListener("click", () => {
                moderationState.modal = {
                    type: "queueRemove",
                    title: "Clear queue entry",
                    description: "Remove one waiting/stale matchmaking entry. Active matches are not affected.",
                    queueEntryRef: button.dataset.queueRemove
                };
                moderationState.error = "";
                renderActivePanel();
            });
        });

        const filters = panel.querySelector("[data-audit-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            auditState.filters = {
                action: String(formData.get("action") || ""),
                targetType: String(formData.get("targetType") || ""),
                adminEmail: String(formData.get("adminEmail") || "").trim(),
                targetEmail: String(formData.get("targetEmail") || "").trim()
            };
            auditState.loaded = false;
            void loadAuditLogs();
        });

        panel.querySelector("[data-audit-clear]")?.addEventListener("click", () => {
            auditState.filters = {
                action: "",
                targetType: "",
                adminEmail: "",
                targetEmail: ""
            };
            auditState.loaded = false;
            void loadAuditLogs();
        });

        panel.querySelector("[data-audit-load-more]")?.addEventListener("click", () => {
            if (auditState.nextCursor) {
                void loadAuditLogs({
                    cursor: auditState.nextCursor,
                    append: true
                });
            }
        });

        panel.querySelectorAll("[data-audit-view]").forEach((button) => {
            button.addEventListener("click", () => {
                auditState.detail = auditState.items.find((item) => item.id === button.dataset.auditView) || null;
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-audit-detail-close]").forEach((button) => {
            button.addEventListener("click", () => {
                auditState.detail = null;
                renderActivePanel();
            });
        });
    }

    function renderFeedbackPanel(panel, module) {
        const summary = feedbackState.summary;
        const pendingValue = feedbackState.summaryError ? "Unavailable" : "Loading...";
        const summaryValue = (key) => summary && !feedbackState.summaryError ? summary[key] || 0 : pendingValue;

        panel.innerHTML = `
            <div class="admin-module-heading">
                <p class="premium-kicker">${escapeHtml(module.label)}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>${escapeHtml(module.description)}</p>
            </div>
            <div class="admin-feedback-summary">
                ${renderFeedbackSummaryCard("Total feedback", summaryValue("total"))}
                ${renderFeedbackSummaryCard("Open bugs", summaryValue("openBugs"))}
                ${renderFeedbackSummaryCard("Open suggestions", summaryValue("openSuggestions"))}
                ${renderFeedbackSummaryCard("Fixed items", summaryValue("fixed"))}
            </div>
            <form class="admin-feedback-filters" data-feedback-filters>
                <label>
                    <span>Status</span>
                    <select name="status">
                        <option value="">All</option>
                        ${FEEDBACK_STATUSES.map((status) => `<option value="${status}"${feedbackState.filters.status === status ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Type</span>
                    <select name="type">
                        <option value="">All</option>
                        ${FEEDBACK_TYPES.map((type) => `<option value="${type}"${feedbackState.filters.type === type ? " selected" : ""}>${escapeHtml(titleCase(type))}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <span>Game</span>
                    <input name="gameSlug" type="search" value="${escapeHtml(feedbackState.filters.gameSlug)}" placeholder="game slug">
                </label>
                <label>
                    <span>Search</span>
                    <input name="search" type="search" value="${escapeHtml(feedbackState.filters.search)}" placeholder="message, page, user">
                </label>
                <div class="admin-feedback-filter-actions">
                    <button class="premium-primary-button" type="submit">${icon("search")}<span>Apply</span></button>
                    <button class="premium-ghost-button" type="button" data-feedback-clear>${icon("close")}<span>Clear</span></button>
                </div>
            </form>
            ${renderFeedbackList()}
            ${renderFeedbackDetail()}
        `;

        bindFeedbackPanel(panel);
        window.GameHubPremium?.hydrateIcons?.(panel);
        if (!feedbackState.loaded && !feedbackState.loading) {
            void loadFeedback({ silent: true });
        }
    }

    function renderFeedbackSummaryCard(title, value) {
        return `
            <article class="admin-feedback-summary-card">
                <span>${escapeHtml(title)}</span>
                <strong>${escapeHtml(String(value))}</strong>
            </article>
        `;
    }

    function renderFeedbackList() {
        if (feedbackState.loading) {
            return `<article class="admin-placeholder-card"><strong>Loading feedback...</strong><p>Fetching reports from the server.</p></article>`;
        }

        if (feedbackState.error) {
            return `<article class="admin-placeholder-card admin-feedback-error"><strong>Could not load feedback</strong><p>${escapeHtml(feedbackState.error)}</p></article>`;
        }

        if (!feedbackState.items.length) {
            return `<article class="admin-placeholder-card"><strong>No feedback found</strong><p>Submitted reports will appear here.</p></article>`;
        }

        return `
            <div class="admin-feedback-table" role="table" aria-label="Feedback reports">
                <div class="admin-feedback-row admin-feedback-row--head" role="row">
                    <span>Date</span>
                    <span>Type</span>
                    <span>Game/Page</span>
                    <span>Message</span>
                    <span>User</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>
                ${feedbackState.items.map(renderFeedbackRow).join("")}
            </div>
            ${feedbackState.nextCursor ? `
                <button class="premium-ghost-button admin-feedback-load-more" type="button" data-feedback-load-more>
                    ${icon("layers")}
                    <span>Load more</span>
                </button>
            ` : ""}
        `;
    }

    function renderFeedbackRow(item) {
        const user = item.verifiedUserEmail || item.contactEmail || shortSession(item.anonymousSessionId);
        const game = item.gameTitle || item.gameSlug || item.path || "Unknown";
        const rating = item.rating ? ` - ${item.rating}/5` : "";
        return `
            <div class="admin-feedback-row" role="row" data-feedback-id="${escapeHtml(item.id)}">
                <span>${escapeHtml(formatDate(item.createdAt))}</span>
                <span><b>${escapeHtml(titleCase(item.type))}</b>${escapeHtml(rating)}</span>
                <span>${escapeHtml(shortText(game, 72))}</span>
                <span>${escapeHtml(shortText(item.message, 110))}</span>
                <span>${escapeHtml(shortText(user, 54))}</span>
                <span><em class="admin-feedback-status-pill is-${escapeHtml(item.status)}">${escapeHtml(titleCase(item.status))}</em></span>
                <span class="admin-feedback-actions-cell">
                    <button type="button" data-feedback-view="${escapeHtml(item.id)}">View</button>
                    ${renderFeedbackStatusButton(item, "reviewed", "Reviewed")}
                    ${renderFeedbackStatusButton(item, "fixed", "Fixed")}
                    ${renderFeedbackStatusButton(item, "ignored", "Ignored")}
                    ${item.status !== "open" ? renderFeedbackStatusButton(item, "open", "Reopen") : ""}
                </span>
            </div>
        `;
    }

    function renderFeedbackStatusButton(item, status, label) {
        if (item.status === status) {
            return "";
        }
        return `<button type="button" data-feedback-status="${escapeHtml(status)}" data-feedback-id="${escapeHtml(item.id)}">${escapeHtml(label)}</button>`;
    }

    function renderFeedbackDetail() {
        const item = feedbackState.detail;
        if (!item) {
            return "";
        }

        return `
            <div class="admin-feedback-detail" role="dialog" aria-modal="true" aria-label="Feedback detail">
                <button class="admin-feedback-detail-backdrop" type="button" data-feedback-detail-close aria-label="Close feedback detail"></button>
                <section class="admin-feedback-detail-card">
                    <button class="admin-feedback-detail-close" type="button" data-feedback-detail-close aria-label="Close">X</button>
                    <p class="premium-kicker">${escapeHtml(titleCase(item.type))}</p>
                    <h3>${escapeHtml(item.gameTitle || item.gameSlug || "Feedback report")}</h3>
                    <dl class="admin-feedback-detail-meta">
                        <div><dt>Status</dt><dd>${escapeHtml(titleCase(item.status))}</dd></div>
                        <div><dt>Rating</dt><dd>${item.rating ? `${escapeHtml(String(item.rating))}/5` : "None"}</dd></div>
                        <div><dt>Created</dt><dd>${escapeHtml(formatDate(item.createdAt))}</dd></div>
                        <div><dt>Path</dt><dd>${escapeHtml(item.path || "Unknown")}</dd></div>
                        <div><dt>User</dt><dd>${escapeHtml(item.verifiedUserEmail || item.contactEmail || "Anonymous")}</dd></div>
                        <div><dt>Session</dt><dd>${escapeHtml(shortSession(item.anonymousSessionId))}</dd></div>
                        <div><dt>User agent</dt><dd>${escapeHtml(item.userAgent || "Unknown")}</dd></div>
                    </dl>
                    <div class="admin-feedback-message-full">
                        <strong>Message</strong>
                        <p>${escapeHtml(item.message)}</p>
                    </div>
                    <form class="admin-feedback-note-form" data-feedback-note-form data-feedback-id="${escapeHtml(item.id)}">
                        <label>
                            <span>Status</span>
                            <select name="status">
                                ${FEEDBACK_STATUSES.map((status) => `<option value="${status}"${item.status === status ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>`).join("")}
                            </select>
                        </label>
                        <label>
                            <span>Admin note</span>
                            <textarea name="adminNote" maxlength="1000">${escapeHtml(item.adminNote || "")}</textarea>
                        </label>
                        <div class="admin-feedback-detail-actions">
                            <button class="premium-primary-button" type="submit">${icon("check")}<span>Save</span></button>
                            <button class="premium-ghost-button" type="button" data-feedback-detail-close>${icon("close")}<span>Close</span></button>
                        </div>
                    </form>
                </section>
            </div>
        `;
    }

    function bindFeedbackPanel(panel) {
        const filters = panel.querySelector("[data-feedback-filters]");
        filters?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(filters);
            feedbackState.filters = {
                status: String(formData.get("status") || ""),
                type: String(formData.get("type") || ""),
                gameSlug: String(formData.get("gameSlug") || "").trim(),
                search: String(formData.get("search") || "").trim()
            };
            feedbackState.loaded = false;
            void loadFeedback();
        });

        panel.querySelector("[data-feedback-clear]")?.addEventListener("click", () => {
            feedbackState.filters = {
                status: "",
                type: "",
                gameSlug: "",
                search: ""
            };
            feedbackState.loaded = false;
            void loadFeedback();
        });

        panel.querySelector("[data-feedback-load-more]")?.addEventListener("click", () => {
            if (feedbackState.nextCursor) {
                void loadFeedback({
                    cursor: feedbackState.nextCursor,
                    append: true
                });
            }
        });

        panel.querySelectorAll("[data-feedback-view]").forEach((button) => {
            button.addEventListener("click", () => {
                feedbackState.detail = feedbackState.items.find((item) => item.id === button.dataset.feedbackView) || null;
                renderActivePanel();
            });
        });

        panel.querySelectorAll("[data-feedback-status]").forEach((button) => {
            button.addEventListener("click", () => {
                void updateFeedback(button.dataset.feedbackId, {
                    status: button.dataset.feedbackStatus
                });
            });
        });

        panel.querySelectorAll("[data-feedback-detail-close]").forEach((button) => {
            button.addEventListener("click", () => {
                feedbackState.detail = null;
                renderActivePanel();
            });
        });

        panel.querySelector("[data-feedback-note-form]")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            void updateFeedback(form.dataset.feedbackId, {
                status: formData.get("status"),
                adminNote: formData.get("adminNote")
            });
        });
    }

    async function updateFeedback(id, patch) {
        try {
            const payload = await adminFetch(`/api/admin/feedback/${encodeURIComponent(id)}`, {
                method: "PATCH",
                body: JSON.stringify(patch)
            });
            const updated = payload.item;
            if (updated) {
                feedbackState.items = feedbackState.items.map((item) => item.id === updated.id ? updated : item);
                if (feedbackState.detail?.id === updated.id) {
                    feedbackState.detail = updated;
                }
                await loadFeedbackSummary();
                if (auditState.loaded) {
                    await loadAuditLogs({ silent: true });
                }
                renderActivePanel();
            }
        } catch (error) {
            feedbackState.error = error?.message || "Could not update feedback.";
            renderActivePanel();
        }
    }

    async function init() {
        renderLoading();
        if (!window.GameHubAdminAccess?.checkAdmin) {
            renderLoginRequired("Admin verification could not be loaded.");
            return;
        }

        const result = await window.GameHubAdminAccess.checkAdmin();
        if (result.state === "admin") {
            renderDashboard(result.email, result.token);
            lastRefreshAt = new Date().toISOString();
            updateAdminHeader();
            void loadFeedbackSummary();
            void loadModerationOverview({ silent: true });
            void loadAnalyticsOverview({ silent: true });
            void loadCatalogOverview({ silent: true });
            void loadAccountsOverview({ silent: true });
            void loadRealtimeOverview({ silent: true });
            void loadSystemHealth({ silent: true });
            return;
        }
        if (result.state === "access-denied") {
            renderAccessDenied(result.email);
            return;
        }
        renderLoginRequired(result.reason);
    }
})();
