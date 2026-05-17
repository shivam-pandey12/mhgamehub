import { getApps, initializeApp } from "/assets/vendor/firebase/firebase-app.js";
import {
    GoogleAuthProvider,
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "/assets/vendor/firebase/firebase-auth.js";

const APP_NAME = "gamehub-premium-site";
const listeners = new Set();

let firebaseApp = null;
let firebaseAuth = null;
let readyResolved = false;
let resolveReadyPromise = () => {};
let sessionTicketPromise = null;

const state = {
    configured: false,
    initialized: false,
    authenticated: false,
    user: null,
    firebaseConfig: null,
    ticket: null,
    provider: "firebase",
    mode: "firebase-pending",
    error: null
};

const readyPromise = new Promise((resolve) => {
    resolveReadyPromise = resolve;
});

function toSerializableUser(user) {
    if (!user) {
        return null;
    }

    return {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        emailVerified: user.emailVerified === true,
        isAnonymous: user.isAnonymous === true,
        providerIds: Array.isArray(user.providerData)
            ? user.providerData.map((entry) => entry?.providerId).filter(Boolean)
            : []
    };
}

function getSessionSnapshot() {
    return {
        configured: state.configured === true,
        initialized: state.initialized === true,
        authenticated: state.authenticated === true,
        user: state.user ? { ...state.user } : null,
        firebaseConfig: state.firebaseConfig ? { ...state.firebaseConfig } : null,
        ticket: state.ticket ? { ...state.ticket } : null,
        provider: state.provider,
        mode: state.mode,
        error: state.error || null
    };
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function initialsFromUser(user) {
    const source = String(user?.displayName || user?.email || "PM").trim();
    const tokens = source.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
        return `${tokens[0][0] || ""}${tokens[1][0] || ""}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
}

function ensureMemberChipMenu() {
    const chip = document.getElementById("premium-member-chip");
    if (!chip) {
        return null;
    }

    let container = chip.parentElement?.classList.contains("premium-member-menu")
        ? chip.parentElement
        : null;

    if (!container) {
        container = document.createElement("div");
        container.className = "premium-member-menu";
        chip.parentNode?.insertBefore(container, chip);
        container.appendChild(chip);
    }

    let dropdown = container.querySelector(".premium-member-dropdown");
    if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.className = "premium-member-dropdown";
        dropdown.innerHTML = `
            <button class="premium-member-logout" type="button" hidden>
                Sign out
            </button>
        `;
        container.appendChild(dropdown);
    }

    const logoutButton = dropdown.querySelector(".premium-member-logout");
    if (logoutButton && !logoutButton.dataset.bound) {
        logoutButton.dataset.bound = "1";
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!window.GameHubPremiumAuth?.signOutUser) {
                return;
            }

            const label = logoutButton.textContent;
            logoutButton.disabled = true;
            logoutButton.textContent = "Signing out...";

            try {
                await window.GameHubPremiumAuth.signOutUser();
                window.GameHubPremium?.clearAuthIntent?.();
            } catch (error) {
                console.error("Premium sign-out failed:", error);
            } finally {
                logoutButton.disabled = false;
                logoutButton.textContent = label || "Sign out";
            }
        });
    }

    return {
        chip,
        container,
        dropdown,
        logoutButton
    };
}

function syncAccountLinks(snapshot) {
    document.querySelectorAll('a[href^="/premium/login"], a[data-premium-account-link="login"]').forEach((link) => {
        if (!(link instanceof HTMLAnchorElement) || link.id === "premium-member-chip") {
            return;
        }

        if (!link.dataset.premiumAccountHrefOriginal) {
            link.dataset.premiumAccountHrefOriginal = link.getAttribute("href") || "/premium/login";
        }

        if (snapshot?.authenticated) {
            link.dataset.premiumAccountLink = "login";
            link.href = "/premium";
            return;
        }

        link.href = link.dataset.premiumAccountHrefOriginal || "/premium/login";
    });
}

function renderHeaderMemberChip(snapshot) {
    syncAccountLinks(snapshot);
    const menu = ensureMemberChipMenu();
    if (!menu?.chip) {
        return;
    }
    const { chip, container, logoutButton } = menu;
    const showProfileName = chip.classList.contains("premium-member-chip--profile");

    if (!snapshot?.authenticated || !snapshot.user) {
        chip.removeAttribute("hidden");
        chip.innerHTML = showProfileName
            ? `
                <span class="premium-member-avatar premium-member-avatar--icon" aria-hidden="true">${window.GameHubPremium?.icon?.("user") || ""}</span>
                <span class="premium-member-meta">
                    <span class="premium-member-label">Profile</span>
                    <span class="premium-member-name">Sign in</span>
                </span>
            `
            : `
                <span class="premium-member-avatar">${initialsFromUser({ displayName: "PM" })}</span>
                <span class="premium-member-meta">
                    <span class="premium-member-label">Profile</span>
                    <span class="premium-member-name">Sign in</span>
                </span>
            `;
        chip.href = "/premium/login";
        chip.setAttribute("aria-label", "Sign in");
        chip.removeAttribute("aria-haspopup");
        chip.setAttribute("title", "Sign in");
        container?.classList.remove("is-authenticated");
        if (logoutButton) {
            logoutButton.hidden = true;
        }
        return;
    }

    const avatarMarkup = snapshot.user.photoURL
        ? `<span class="premium-member-avatar"><img src="${escapeHtml(snapshot.user.photoURL)}" alt=""></span>`
        : `<span class="premium-member-avatar">${escapeHtml(initialsFromUser(snapshot.user))}</span>`;
    const memberName = snapshot.user.displayName || snapshot.user.email || "Account";
    chip.removeAttribute("hidden");
    chip.href = "/premium/login";
    chip.innerHTML = showProfileName
        ? `
            ${avatarMarkup}
            <span class="premium-member-meta">
                <span class="premium-member-label">Profile</span>
                <span class="premium-member-name">${escapeHtml(memberName)}</span>
            </span>
        `
        : `
            ${avatarMarkup}
            <span class="premium-member-meta">
                <span class="premium-member-label">Profile</span>
                <span class="premium-member-name">${escapeHtml(memberName)}</span>
            </span>
        `;
    chip.href = "/premium";
    chip.setAttribute("aria-label", `Profile: ${memberName}`);
    chip.setAttribute("aria-haspopup", "menu");
    chip.setAttribute("title", memberName);
    container?.classList.add("is-authenticated");
    if (logoutButton) {
        logoutButton.hidden = false;
    }
}

function fallbackStore(key, value) {
    try {
        if (value == null) {
            window.localStorage?.removeItem(key);
            return;
        }
        window.localStorage?.setItem(key, JSON.stringify(value));
    } catch (_) {
        // Best-effort fallback only.
    }
}

function persistSharedConfig(config) {
    if (window.GameHubPremium?.persistSharedFirebaseConfig) {
        window.GameHubPremium.persistSharedFirebaseConfig(config);
        return;
    }

    fallbackStore("gamehubPremium.sharedFirebaseConfig", config);
}

function persistSharedIdentity(identity) {
    if (window.GameHubPremium?.persistSharedIdentity) {
        window.GameHubPremium.persistSharedIdentity(identity);
        return;
    }

    fallbackStore("gamehubPremium.sharedIdentity", identity);
}

function persistSharedTicket(ticket) {
    if (window.GameHubPremium?.persistSharedTicket) {
        window.GameHubPremium.persistSharedTicket(ticket);
        return;
    }

    fallbackStore("gamehubPremium.sharedTicket", ticket);
}

function emitSession() {
    const snapshot = getSessionSnapshot();
    renderHeaderMemberChip(snapshot);
    listeners.forEach((listener) => {
        try {
            listener(snapshot);
        } catch (error) {
            console.warn("Premium auth listener failed:", error);
        }
    });
    return snapshot;
}

function resolveReady() {
    if (readyResolved) {
        return;
    }

    readyResolved = true;
    resolveReadyPromise(getSessionSnapshot());
}

function formatAuthError(error) {
    const code = String(error?.code || "");
    switch (code) {
        case "auth/invalid-email":
            return "Enter a valid email address for premium access.";
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "That email and password pair was not accepted by Firebase.";
        case "auth/email-already-in-use":
            return "That email already has a premium Firebase account.";
        case "auth/weak-password":
            return "Choose a stronger password with at least 6 characters.";
        case "auth/popup-blocked":
            return "The sign-in popup was blocked. Allow popups and try again.";
        case "auth/popup-closed-by-user":
            return "The sign-in popup was closed before Firebase could finish.";
        case "auth/unauthorized-domain":
            return "This host is not yet authorized in your Firebase console.";
        case "auth/operation-not-allowed":
            return "This Firebase sign-in method is not enabled for the premium project.";
        case "auth/network-request-failed":
            return "Firebase could not be reached. Check the network and try again.";
        default:
            return error?.message || "Premium Firebase sign-in failed.";
    }
}

async function fetchFirebaseConfig() {
    const response = await fetch("/api/premium-auth/config", {
        headers: { Accept: "application/json" },
        cache: "no-store"
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || `Premium Firebase config request failed with status ${response.status}`);
    }

    return payload;
}

async function ensureAuthReady() {
    await readyPromise;
    if (!state.configured || !firebaseAuth) {
        throw new Error(state.error || "Premium Firebase is not configured yet.");
    }
    return firebaseAuth;
}

async function getCurrentIdToken(forceRefresh = false) {
    const auth = await ensureAuthReady();
    if (!auth.currentUser) {
        return "";
    }

    return auth.currentUser.getIdToken(forceRefresh);
}

async function exchangeSessionTicket(forceRefresh = false) {
    if (!state.authenticated) {
        state.ticket = null;
        persistSharedTicket(null);
        return null;
    }

    if (sessionTicketPromise && !forceRefresh) {
        return sessionTicketPromise;
    }

    sessionTicketPromise = (async () => {
        const idToken = await getCurrentIdToken(forceRefresh);
        if (!idToken) {
            state.ticket = null;
            persistSharedTicket(null);
            return null;
        }

        const response = await fetch("/api/premium-auth/exchange", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({ idToken })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(payload.error || `Premium session exchange failed with status ${response.status}`);
        }

        state.ticket = payload.ticket && typeof payload.ticket === "object" ? payload.ticket : null;
        persistSharedTicket(state.ticket);
        emitSession();
        return state.ticket;
    })();

    try {
        return await sessionTicketPromise;
    } finally {
        sessionTicketPromise = null;
    }
}

async function initializePremiumFirebaseAuth() {
    try {
        const payload = await fetchFirebaseConfig();
        state.configured = payload.configured === true;
        state.mode = state.configured ? "firebase-client" : "firebase-pending";
        state.error = payload.error || null;
        state.firebaseConfig = payload.config && typeof payload.config === "object" ? payload.config : null;
        persistSharedConfig(state.firebaseConfig);

        if (!state.configured || !payload.config) {
            state.initialized = true;
            persistSharedIdentity(null);
            persistSharedTicket(null);
            emitSession();
            resolveReady();
            return;
        }

        firebaseApp = getApps().find((app) => app.name === APP_NAME) || initializeApp(payload.config, APP_NAME);

        firebaseAuth = getAuth(firebaseApp);
        try {
            await setPersistence(firebaseAuth, browserLocalPersistence);
        } catch (error) {
            console.warn("Premium Firebase persistence setup failed:", error);
            state.error = formatAuthError(error);
        }

        onAuthStateChanged(firebaseAuth, (user) => {
            const serializableUser = toSerializableUser(user);
            const isMemberSession = Boolean(serializableUser && serializableUser.isAnonymous !== true);
            state.initialized = true;
            state.authenticated = isMemberSession;
            state.user = isMemberSession ? serializableUser : null;
            persistSharedIdentity(state.user);
            if (state.authenticated) {
                state.mode = "firebase-client";
                void exchangeSessionTicket(false).catch((error) => {
                    state.error = formatAuthError(error);
                    emitSession();
                });
            } else {
                state.ticket = null;
                persistSharedTicket(null);
            }
            emitSession();
            resolveReady();
        }, (error) => {
            state.initialized = true;
            state.authenticated = false;
            state.user = null;
            state.ticket = null;
            state.mode = "firebase-error";
            state.error = formatAuthError(error);
            persistSharedIdentity(null);
            persistSharedTicket(null);
            emitSession();
            resolveReady();
        });
    } catch (error) {
        state.initialized = true;
        state.configured = false;
        state.authenticated = false;
        state.user = null;
        state.firebaseConfig = null;
        state.ticket = null;
        state.mode = "firebase-error";
        state.error = formatAuthError(error);
        persistSharedConfig(null);
        persistSharedIdentity(null);
        persistSharedTicket(null);
        emitSession();
        resolveReady();
    }
}

async function signInWithEmail(email, password) {
    const auth = await ensureAuthReady();
    state.error = null;
    await signInWithEmailAndPassword(auth, String(email || "").trim(), String(password || ""));
    return getSessionSnapshot();
}

async function registerWithEmail(email, password) {
    const auth = await ensureAuthReady();
    state.error = null;
    await createUserWithEmailAndPassword(auth, String(email || "").trim(), String(password || ""));
    return getSessionSnapshot();
}

async function signInWithGoogleAccount() {
    const auth = await ensureAuthReady();
    state.error = null;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
    return getSessionSnapshot();
}

async function signOutUser() {
    const auth = await ensureAuthReady();
    await signOut(auth);
    return getSessionSnapshot();
}

function subscribe(listener) {
    if (typeof listener !== "function") {
        return () => {};
    }

    listeners.add(listener);
    listener(getSessionSnapshot());
    return () => {
        listeners.delete(listener);
    };
}

window.GameHubPremiumAuth = {
    ready() {
        return readyPromise.then(() => getSessionSnapshot());
    },
    getSession() {
        return getSessionSnapshot();
    },
    subscribe,
    getFirebaseConfig() {
        return state.firebaseConfig ? { ...state.firebaseConfig } : null;
    },
    async getIdToken(forceRefresh = false) {
        try {
            return await getCurrentIdToken(forceRefresh);
        } catch (_) {
            return "";
        }
    },
    async exchangeSessionTicket(forceRefresh = false) {
        try {
            return await exchangeSessionTicket(forceRefresh);
        } catch (error) {
            const message = formatAuthError(error);
            state.error = message;
            emitSession();
            throw new Error(message);
        }
    },
    async signInWithEmail(email, password) {
        try {
            return await signInWithEmail(email, password);
        } catch (error) {
            const message = formatAuthError(error);
            state.error = message;
            emitSession();
            throw new Error(message);
        }
    },
    async registerWithEmail(email, password) {
        try {
            return await registerWithEmail(email, password);
        } catch (error) {
            const message = formatAuthError(error);
            state.error = message;
            emitSession();
            throw new Error(message);
        }
    },
    async signInWithGoogle() {
        try {
            return await signInWithGoogleAccount();
        } catch (error) {
            const message = formatAuthError(error);
            state.error = message;
            emitSession();
            throw new Error(message);
        }
    },
    async signOutUser() {
        try {
            return await signOutUser();
        } catch (error) {
            const message = formatAuthError(error);
            state.error = message;
            emitSession();
            throw new Error(message);
        }
    }
};

void initializePremiumFirebaseAuth();
