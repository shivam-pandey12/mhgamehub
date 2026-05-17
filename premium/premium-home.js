(function attachPremiumHome() {
    "use strict";

    const premium = window.GameHubPremium;
    if (!premium) {
        console.error("GameHubPremium helpers are missing.");
        return;
    }

    const state = {
        games: [],
        session: {
            authenticated: false,
            user: null,
            mode: "firebase-pending",
            provider: "firebase",
            configured: false
        },
        watchlist: premium.loadWatchlist(),
        recent: premium.loadRecent(),
        stats: premium.loadStats(),
        query: "",
        filter: "all"
    };

    document.addEventListener("DOMContentLoaded", () => {
        void init();
    });

    async function init() {
        const [games, session] = await Promise.all([
            premium.loadPremiumCatalog(),
            premium.loadPremiumSession()
        ]);

        state.games = Array.isArray(games) ? games : [];
        state.session = session || state.session;

        renderHero();
        renderFilters();
        renderRecentPlay();
        renderCatalog();
        renderSignals();
        renderSessionState();
        bindSearchControls();
        premium.primeReveal?.(document.querySelector(".premium-main"));
    }

    function normalizeSearch(value) {
        return String(value || "").trim().toLowerCase();
    }

    function getSearchText(game) {
        return [
            game.name,
            game.subtitle,
            game.description,
            game.category,
            game.type,
            game.mark,
            game.accessLevel,
            game.accountMode,
            premium.runtimeLabel(game.runtimeKind),
            premium.loadProfileLabel(game.loadProfile),
            ...(Array.isArray(game.tags) ? game.tags : [])
        ].filter(Boolean).join(" ").toLowerCase();
    }

    function getRecentGames() {
        const seen = new Set();
        return state.recent
            .map((id) => state.games.find((game) => game.id === id))
            .filter((game) => {
                if (!game || seen.has(game.id)) {
                    return false;
                }
                seen.add(game.id);
                return true;
            });
    }

    function getFilteredGames() {
        const query = normalizeSearch(state.query);
        let games = [...state.games];

        if (state.filter === "recent") {
            games = getRecentGames();
        } else if (state.filter === "saved") {
            games = games.filter((game) => state.watchlist.includes(game.id));
        } else if (state.filter !== "all") {
            games = games.filter((game) => normalizeSearch(game.category) === state.filter);
        }

        if (query) {
            games = games.filter((game) => getSearchText(game).includes(query));
        }

        return games;
    }

    function bindSearchControls() {
        const input = document.getElementById("premium-search-input");
        if (!input || input.dataset.bound === "1") {
            return;
        }

        input.dataset.bound = "1";
        input.addEventListener("input", () => {
            state.query = input.value;
            renderCatalog();
            renderFilters();
        });
    }

    function renderFilters() {
        const toolbar = document.getElementById("premium-filter-toolbar");
        if (!toolbar) {
            return;
        }

        const categoryFilters = [...new Set(state.games.map((game) => game.category).filter(Boolean))]
            .slice(0, 6)
            .map((category) => ({ id: normalizeSearch(category), label: category }));
        const filters = [
            { id: "all", label: "All" },
            { id: "recent", label: "Recent" },
            { id: "saved", label: "Saved" },
            ...categoryFilters
        ];

        toolbar.innerHTML = filters.map((filter) => `
            <button class="premium-filter-chip${state.filter === filter.id ? " is-active" : ""}" type="button" data-premium-filter="${premium.escapeHtml(filter.id)}">
                ${premium.escapeHtml(filter.label)}
            </button>
        `).join("");

        toolbar.querySelectorAll("[data-premium-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                state.filter = button.dataset.premiumFilter || "all";
                renderFilters();
                renderCatalog();
            });
        });

        premium.primeReveal?.(toolbar.closest(".premium-search-section") || toolbar);
    }

    function renderRecentPlay() {
        const copy = document.getElementById("premium-recent-copy");
        const grid = document.getElementById("premium-recent-grid");
        if (!copy || !grid) {
            return;
        }

        const recentGames = getRecentGames();
        const hasRecent = recentGames.length > 0;
        const games = (hasRecent ? recentGames : state.games).slice(0, 3);
        copy.textContent = hasRecent
            ? "Jump back into the premium games opened most recently on this device."
            : "No recent sessions yet. Start with these premium releases.";

        if (!games.length) {
            grid.innerHTML = `
                <article class="premium-empty-card">
                    <h3>No games available</h3>
                    <p>Add a release to the catalog to show recent play here.</p>
                </article>
            `;
            return;
        }

        grid.innerHTML = games.map((game, index) => `
            <article class="premium-recent-card" style="--premium-card-accent:${premium.escapeHtml(game.accent)}; --premium-card-accent-alt:${premium.escapeHtml(game.accentAlt)};">
                <img src="${game.thumbnail}" alt="${premium.escapeHtml(game.name)} artwork">
                <div class="premium-recent-card-body">
                    <div class="premium-recent-topline">
                        <span>${hasRecent ? "Recent" : `Start ${String(index + 1).padStart(2, "0")}`}</span>
                        <span>${premium.escapeHtml(premium.runtimeLabel(game.runtimeKind))}</span>
                    </div>
                    <h3>${premium.escapeHtml(game.name)}</h3>
                    <p>${premium.escapeHtml(game.subtitle)}</p>
                    <a class="premium-secondary-button" href="/premium/play?id=${encodeURIComponent(game.id)}">
                        ${premium.icon("play")}
                        <span>Play again</span>
                    </a>
                </div>
            </article>
        `).join("");

        premium.primeReveal?.(grid);
    }

    function renderHero() {
        const featured = state.games[0] || null;
        const heroTitle = document.getElementById("premium-hero-title");
        const heroCopy = document.getElementById("premium-hero-copy");
        const heroRibbon = document.getElementById("premium-hero-ribbon");
        const heroSpotlight = document.getElementById("premium-hero-spotlight");
        const heroFeatured = document.getElementById("premium-featured-panel");
        const heroStats = document.getElementById("premium-hero-stats");
        const skyline = document.getElementById("premium-skyline");

        const openCount = state.games.filter((game) => game.accessLevel === "open").length;
        const realtimeCount = state.games.filter((game) => game.runtimeKind === "io").length;
        const firebaseCount = state.games.filter((game) => game.accountMode === "firebase-in-game").length;
        const shortlistCount = state.watchlist.length;
        const marquee = state.games.slice(0, 3).map((game) => game.name).join(", ");

        if (featured) {
            document.documentElement.style.setProperty("--premium-accent", featured.accent);
            document.documentElement.style.setProperty("--premium-accent-alt", featured.accentAlt);
        }

        if (heroTitle) {
            heroTitle.textContent = "Premium arcade, tuned for deep play.";
        }

        if (heroCopy) {
            heroCopy.textContent = `${state.games.length} curated releases are ready here. ${marquee || "Current releases"} launch from a richer premium deck, with realtime rooms and account sync where each game supports it.`;
        }

        if (heroRibbon) {
            heroRibbon.innerHTML = `
                <article class="premium-ribbon-card">
                    <span class="premium-ribbon-icon">${premium.icon("crown")}</span>
                    <div class="premium-ribbon-copy">
                        <small>Live</small>
                        <strong>${openCount} available now</strong>
                        <p>Polished cards, quick loading, and direct launches.</p>
                    </div>
                </article>
                <article class="premium-ribbon-card">
                    <span class="premium-ribbon-icon">${premium.icon("radar")}</span>
                    <div class="premium-ribbon-copy">
                        <small>Online</small>
                        <strong>${realtimeCount} realtime titles</strong>
                        <p>Room-based titles keep the premium catalog alive.</p>
                    </div>
                </article>
                <article class="premium-ribbon-card">
                    <span class="premium-ribbon-icon">${premium.icon("key")}</span>
                    <div class="premium-ribbon-copy">
                        <small>Account</small>
                        <strong>${firebaseCount} supported games</strong>
                        <p>Progress and identity flow through supported games.</p>
                    </div>
                </article>
            `;
        }

        if (heroSpotlight) {
            heroSpotlight.innerHTML = state.games.slice(0, 3).map((game, index) => `
                <article class="premium-rail-card" style="--premium-card-accent:${premium.escapeHtml(game.accent)}; --premium-card-accent-alt:${premium.escapeHtml(game.accentAlt)};">
                    <div class="premium-rail-card-top">
                        <span class="premium-rail-rank">0${index + 1}</span>
                        <span class="premium-rail-phase">${premium.escapeHtml(game.releasePhase || "Available")}</span>
                    </div>
                    <div class="premium-rail-copy">
                        <strong>${premium.escapeHtml(game.name)}</strong>
                        <span>${premium.escapeHtml(game.accountMode === "firebase-in-game" ? "Account sync" : premium.runtimeLabel(game.runtimeKind))}</span>
                    </div>
                </article>
            `).join("");
        }

        if (heroStats) {
            heroStats.innerHTML = `
                <article class="premium-stat-card">
                    <span class="premium-stat-label">Games</span>
                    <strong>${state.games.length}</strong>
                    <span class="premium-stat-meta">available here</span>
                </article>
                <article class="premium-stat-card">
                    <span class="premium-stat-label">Online</span>
                    <strong>${realtimeCount}</strong>
                    <span class="premium-stat-meta">realtime titles</span>
                </article>
                <article class="premium-stat-card">
                    <span class="premium-stat-label">Account</span>
                    <strong>${firebaseCount}</strong>
                    <span class="premium-stat-meta">supported games</span>
                </article>
                <article class="premium-stat-card">
                    <span class="premium-stat-label">Saved</span>
                    <strong>${shortlistCount}</strong>
                    <span class="premium-stat-meta">on this device</span>
                </article>
            `;
        }

        if (heroFeatured) {
            if (!featured) {
                heroFeatured.innerHTML = `
                    <div class="premium-inline-kicker">Library</div>
                    <h3>No games found</h3>
                    <p>Add a release to the catalog to show it here.</p>
                `;
            } else {
                heroFeatured.style.setProperty("--premium-card-accent", featured.accent);
                heroFeatured.style.setProperty("--premium-card-accent-alt", featured.accentAlt);
                heroFeatured.innerHTML = `
                    <div class="premium-feature-header">
                        <span class="premium-media-chip">${premium.escapeHtml(featured.releasePhase || "Live release")}</span>
                        <span class="premium-media-chip premium-media-chip--soft">${premium.escapeHtml(featured.mark)}</span>
                    </div>
                    <div class="premium-feature-visual">
                        <img src="${featured.thumbnail}" alt="${premium.escapeHtml(featured.name)} artwork">
                    </div>
                    <div class="premium-feature-content">
                        <div class="premium-feature-topline">
                            <span class="premium-inline-kicker">${premium.escapeHtml(featured.category)}</span>
                            <span class="premium-inline-kicker">${premium.escapeHtml(featured.type)}</span>
                        </div>
                        <h3>${premium.escapeHtml(featured.name)}</h3>
                        <p>${premium.escapeHtml(featured.description)}</p>
                        <div class="premium-feature-facts">
                            <article class="premium-feature-fact">
                                <small>Mode</small>
                                <strong>${premium.escapeHtml(premium.runtimeLabel(featured.runtimeKind))}</strong>
                            </article>
                            <article class="premium-feature-fact">
                                <small>Load</small>
                                <strong>${premium.escapeHtml(premium.loadProfileLabel(featured.loadProfile))}</strong>
                            </article>
                            <article class="premium-feature-fact">
                                <small>Access</small>
                                <strong>${premium.escapeHtml(featured.accountMode === "firebase-in-game" ? "Account sync" : premium.accessLabel(featured.accessLevel))}</strong>
                            </article>
                        </div>
                        <div class="premium-chip-row">
                            <span class="premium-chip">${premium.icon("layers")} ${premium.escapeHtml(premium.runtimeLabel(featured.runtimeKind))}</span>
                            <span class="premium-chip">${premium.icon("clock")} ${premium.escapeHtml(premium.loadProfileLabel(featured.loadProfile))}</span>
                            <span class="premium-chip">${premium.icon(featured.accountMode === "firebase-in-game" ? "key" : "ticket")} ${premium.escapeHtml(featured.accountMode === "firebase-in-game" ? "Account sync" : "Open access")}</span>
                        </div>
                        <div class="premium-tag-row">
                            ${featured.tags.map((tag) => `<span class="premium-tag">${premium.escapeHtml(tag)}</span>`).join("")}
                        </div>
                        <div class="premium-feature-actions">
                            <a class="premium-primary-button" href="/premium/play?id=${encodeURIComponent(featured.id)}">
                                ${premium.icon("play")}
                                <span>Launch ${premium.escapeHtml(featured.name)}</span>
                            </a>
                            <a class="premium-ghost-button" data-premium-account-link="login" href="/premium/login?game=${encodeURIComponent(featured.id)}">
                                ${premium.icon("key")}
                                <span>Open account</span>
                            </a>
                        </div>
                    </div>
                `;
            }
        }

        if (skyline) {
            skyline.innerHTML = state.games.slice(0, 5).map((game, index) => `
                <div class="premium-skyline-card" style="--premium-card-order:${index}; --premium-card-accent:${premium.escapeHtml(game.accent)};">
                    <img class="premium-skyline-media" src="${game.thumbnail}" alt="${premium.escapeHtml(game.name)} artwork">
                    <div class="premium-skyline-overlay">
                        <small>${String(index + 1).padStart(2, "0")}</small>
                        <span>${premium.escapeHtml(game.mark)}</span>
                        <strong>${premium.escapeHtml(game.name)}</strong>
                        <small>${premium.escapeHtml(game.accountMode === "firebase-in-game" ? "Account sync" : premium.accessLabel(game.accessLevel))}</small>
                    </div>
                </div>
            `).join("");
        }

        premium.primeReveal?.(document.querySelector(".premium-hero"));
    }

    function renderCatalog() {
        const grid = document.getElementById("premium-catalog-grid");
        if (!grid) {
            return;
        }

        if (!state.games.length) {
            grid.innerHTML = `
                <article class="premium-empty-card">
                    <h3>No games available</h3>
                    <p>No catalog entries were found.</p>
                </article>
            `;
            return;
        }

        const catalogGames = getFilteredGames();
        if (!catalogGames.length) {
            grid.innerHTML = `
                <article class="premium-empty-card">
                    <h3>No matching games</h3>
                    <p>Try another search term or switch filters.</p>
                </article>
            `;
            return;
        }

        grid.innerHTML = catalogGames.map((game, index) => {
            const isWatchlisted = state.watchlist.includes(game.id);
            const secondaryStatus = game.accountMode === "firebase-in-game"
                ? "Account sync supported"
                : (game.runtimeKind === "io" ? "Realtime rooms" : "Direct launch");
            const cardHref = `/premium/play?id=${encodeURIComponent(game.id)}`;

            return `
                <article class="premium-game-card" role="link" tabindex="0" aria-label="Open ${premium.escapeHtml(game.name)}" data-premium-card-url="${premium.escapeHtml(cardHref)}" style="--premium-card-accent:${premium.escapeHtml(game.accent)}; --premium-card-accent-alt:${premium.escapeHtml(game.accentAlt)};">
                    <div class="premium-game-thumb">
                        <img src="${game.thumbnail}" alt="${premium.escapeHtml(game.name)} artwork">
                        <div class="premium-thumb-chip-row">
                            <span class="premium-thumb-chip">${premium.escapeHtml(premium.accessLabel(game.accessLevel))}</span>
                            <span class="premium-thumb-chip premium-thumb-chip--accent">Launch ${String(index + 1).padStart(2, "0")}</span>
                        </div>
                    </div>
                    <div class="premium-game-body">
                        <div class="premium-card-topline">
                            <div class="premium-card-ledger">
                                <span class="premium-card-runtime">${premium.icon(game.runtimeKind === "io" ? "radar" : "orbit")} ${premium.escapeHtml(premium.runtimeLabel(game.runtimeKind))}</span>
                                <span class="premium-card-runtime">${premium.icon("layers")} ${premium.escapeHtml(game.releasePhase || "Available")}</span>
                            </div>
                            <button class="premium-watch-toggle${isWatchlisted ? " is-active" : ""}" type="button" data-watchlist-id="${premium.escapeHtml(game.id)}" aria-label="${isWatchlisted ? "Remove from shortlist" : "Add to shortlist"}">
                                ${premium.icon(isWatchlisted ? "check" : "diamond")}
                            </button>
                        </div>
                        <div class="premium-card-heading">
                            <h3>${premium.escapeHtml(game.name)}</h3>
                            <p>${premium.escapeHtml(game.subtitle)}</p>
                        </div>
                        <div class="premium-card-copy">${premium.escapeHtml(game.description)}</div>
                        <div class="premium-card-status-row">
                            <span class="premium-card-account">${premium.icon(game.accountMode === "firebase-in-game" ? "key" : (game.runtimeKind === "io" ? "radar" : "shield"))} ${premium.escapeHtml(game.accountMode === "firebase-in-game" ? "Account sync" : (game.runtimeKind === "io" ? "Realtime rooms" : "Direct launch"))}</span>
                        </div>
                        <div class="premium-chip-row">
                            <span class="premium-chip">${premium.icon("clock")} ${premium.escapeHtml(premium.loadProfileLabel(game.loadProfile))}</span>
                            <span class="premium-chip">${premium.icon(game.accountMode === "firebase-in-game" ? "key" : "shield")} ${premium.escapeHtml(game.accountMode === "firebase-in-game" ? "Account sync" : "Direct launch")}</span>
                        </div>
                        <div class="premium-tag-row">
                            ${game.tags.map((tag) => `<span class="premium-tag">${premium.escapeHtml(tag)}</span>`).join("")}
                        </div>
                        <div class="premium-card-foot">
                            <span class="premium-card-note">${premium.escapeHtml(secondaryStatus)}</span>
                            <a class="premium-secondary-button" href="${premium.escapeHtml(cardHref)}">
                                ${premium.icon("play")}
                                <span>${premium.escapeHtml(game.accountMode === "firebase-in-game" ? "Open game" : `Open ${game.type}`)}</span>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        grid.querySelectorAll("[data-premium-card-url]").forEach((card) => {
            const openCard = () => {
                const targetUrl = card.dataset.premiumCardUrl;
                if (!targetUrl) {
                    return;
                }

                premium.navigateWithTransition?.(targetUrl) || window.location.assign(targetUrl);
            };

            card.addEventListener("click", (event) => {
                if (event.target?.closest?.("a, button, input, select, textarea")) {
                    return;
                }

                openCard();
            });

            card.addEventListener("keydown", (event) => {
                if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
                    return;
                }

                event.preventDefault();
                openCard();
            });
        });

        grid.querySelectorAll("[data-watchlist-id]").forEach((button) => {
            button.addEventListener("click", () => {
                state.watchlist = premium.toggleWatchlist(button.dataset.watchlistId);
                renderFilters();
                renderRecentPlay();
                renderCatalog();
                renderSignals();
                renderHero();
            });
        });

        premium.primeReveal?.(grid);
    }

    function renderSignals() {
        const rail = document.getElementById("premium-signal-rail");
        if (!rail) {
            return;
        }

        const realtimeGames = state.games.filter((game) => game.runtimeKind === "io");
        const firebaseGames = state.games.filter((game) => game.accountMode === "firebase-in-game");
        const recentGame = state.recent
            .map((id) => state.games.find((game) => game.id === id))
            .find(Boolean);

        rail.innerHTML = `
            <article class="premium-signal-card">
                <span class="premium-signal-label">Live</span>
                <strong>${realtimeGames.length}</strong>
                <p>${realtimeGames.length ? `${premium.escapeHtml(realtimeGames.map((game) => game.name).join(", "))} can be played online.` : "No realtime titles are available right now."}</p>
            </article>
            <article class="premium-signal-card">
                <span class="premium-signal-label">Account</span>
                <strong>${firebaseGames.length}</strong>
                <p>${firebaseGames.length ? `${premium.escapeHtml(firebaseGames.map((game) => game.name).join(" and "))} support synced progress.` : "No account-synced games are available right now."}</p>
            </article>
            <article class="premium-signal-card">
                <span class="premium-signal-label">Recent</span>
                <strong>${recentGame ? premium.escapeHtml(recentGame.mark) : "IDLE"}</strong>
                <p>${recentGame ? `${premium.escapeHtml(recentGame.name)} was opened most recently on this device.` : "Open a game to see recent activity here."}</p>
            </article>
        `;

        premium.primeReveal?.(rail);
    }

    function renderSessionState() {
        const sessionNode = document.getElementById("premium-session-copy");
        const authBand = document.getElementById("premium-auth-band");
        if (!sessionNode || !authBand) {
            return;
        }

        const memberLabel = state.session.user?.displayName || state.session.user?.email || "Account";
        const gatewayStatus = state.session.authenticated
            ? "Signed in"
            : (state.session.configured ? "Ready" : "Setup needed");
        sessionNode.textContent = state.session.authenticated
            ? `${memberLabel} is signed in. Supported games can use this account.`
            : state.session.configured
                ? "Sign in to use synced progress in supported games."
                : "Firebase credentials are not configured yet.";

        authBand.innerHTML = `
            <div class="premium-auth-band-copy">
                <p class="premium-inline-kicker">Account</p>
                <h2>Keep premium sessions connected</h2>
                <p class="premium-section-copy">Use email or Google sign-in for the titles that support synced progress.</p>
                <div class="premium-auth-band-state">
                    <span class="premium-chip">${premium.icon("shield")} ${premium.escapeHtml(gatewayStatus)}</span>
                    <span class="premium-chip">${premium.icon("layers")} ${state.games.length} games available</span>
                </div>
            </div>
            <div class="premium-auth-band-actions">
                <a class="premium-primary-button" href="/premium/login">
                    ${premium.icon("key")}
                    <span>${state.session.authenticated ? "Manage account" : "Open account"}</span>
                </a>
                <button class="premium-ghost-button" type="button" disabled>
                    ${premium.icon("shield")}
                    <span>${state.session.authenticated ? "Signed in" : (state.session.configured ? "Ready" : "Not configured")}</span>
                </button>
            </div>
        `;

        premium.primeReveal?.(authBand);
    }
})();
