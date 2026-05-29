const fs = require("fs/promises");
const path = require("path");

const OVERRIDES_COLLECTION = "gameCatalogOverrides";
const FEATURE_FLAGS_COLLECTION = "featureFlags";
const OPERATIONS_CONFIG_COLLECTION = "gamehubOperationsConfig";
const OPERATIONS_CONFIG_DOC = "global";
const LOCAL_OPERATIONS_DIR = ".gamehub-data";
const LOCAL_OPERATIONS_FILE = "catalog-operations.json";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const VISIBILITIES = new Set(["public", "hidden", "coming_soon", "maintenance"]);
const CATALOGS = new Set(["public", "premium"]);
const MAX_PRIORITY = 9999;
const MIN_PRIORITY = -9999;

const KNOWN_FEATURE_FLAGS = {
    feedback_enabled: {
        key: "feedback_enabled",
        enabled: true,
        description: "Allow players to open and submit GameHub feedback.",
        scope: "global"
    },
    analytics_enabled: {
        key: "analytics_enabled",
        enabled: true,
        description: "Allow first-party GameHub analytics events.",
        scope: "global"
    },
    show_updated_labels: {
        key: "show_updated_labels",
        enabled: true,
        description: "Show updated labels on catalog cards.",
        scope: "global"
    },
    show_featured_section: {
        key: "show_featured_section",
        enabled: true,
        description: "Show featured catalog treatments when games are marked featured.",
        scope: "global"
    },
    realtime_monitoring_enabled: {
        key: "realtime_monitoring_enabled",
        enabled: true,
        description: "Enable realtime monitoring panels in admin UI.",
        scope: "global"
    },
    maintenance_banner_enabled: {
        key: "maintenance_banner_enabled",
        enabled: true,
        description: "Allow the public GameHub maintenance/banner strip to render.",
        scope: "global"
    }
};

const DEFAULT_CONFIG = {
    globalBannerEnabled: false,
    globalBannerMessage: "",
    globalMaintenanceMode: false,
    globalMaintenanceMessage: "",
    updatedBy: "",
    updatedAt: "",
    createdAt: ""
};

class CatalogOperationsError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "CatalogOperationsError";
        this.status = status;
        this.code = code;
    }
}

let cachedState = null;

function normalizeText(value, maxLength = 240) {
    return String(value ?? "")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function normalizeMessage(value, maxLength = 1000) {
    return String(value ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
        .trim()
        .slice(0, maxLength);
}

function normalizeEmail(value) {
    const email = normalizeText(value, 180).toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizeCatalog(value) {
    const catalog = normalizeText(value, 40).toLowerCase();
    if (!CATALOGS.has(catalog)) {
        throw new CatalogOperationsError(400, "INVALID_CATALOG", "Catalog must be public or premium.");
    }
    return catalog;
}

function normalizeSlug(value) {
    const slug = normalizeText(value, 160).toLowerCase();
    if (!slug || !/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
        throw new CatalogOperationsError(400, "INVALID_GAME_SLUG", "Invalid game slug.");
    }
    return slug;
}

function normalizeVisibility(value) {
    const visibility = normalizeText(value, 40).toLowerCase();
    if (!VISIBILITIES.has(visibility)) {
        throw new CatalogOperationsError(400, "INVALID_GAME_VISIBILITY", "Invalid game visibility.");
    }
    return visibility;
}

function normalizePriority(value) {
    const priority = Number(value);
    if (!Number.isFinite(priority) || priority < MIN_PRIORITY || priority > MAX_PRIORITY) {
        throw new CatalogOperationsError(400, "INVALID_GAME_PRIORITY", "Priority must be between -9999 and 9999.");
    }
    return Math.trunc(priority);
}

function requireReason(value) {
    const reason = normalizeMessage(value, 500);
    if (reason.length < 5) {
        throw new CatalogOperationsError(400, "CATALOG_REASON_REQUIRED", "A reason of at least 5 characters is required.");
    }
    return reason;
}

function requireConfirmation(value) {
    if (value !== true) {
        throw new CatalogOperationsError(400, "CATALOG_CONFIRMATION_REQUIRED", "Confirmation is required for this operation.");
    }
}

function overrideKey(catalog, slug) {
    return `${catalog}__${slug}`;
}

function toIsoDate(value) {
    if (!value) {
        return "";
    }
    if (typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "" : date.toISOString();
    }
    if (typeof value?.toDate === "function") {
        const date = value.toDate();
        return Number.isNaN(date.getTime()) ? "" : date.toISOString();
    }
    if (typeof value?.toMillis === "function") {
        const date = new Date(value.toMillis());
        return Number.isNaN(date.getTime()) ? "" : date.toISOString();
    }
    return "";
}

function normalizeOverride(raw = {}) {
    const catalog = normalizeText(raw.catalog, 40).toLowerCase();
    const gameSlug = normalizeText(raw.gameSlug || raw.slug, 160).toLowerCase();
    return {
        id: normalizeText(raw.id || (catalog && gameSlug ? overrideKey(catalog, gameSlug) : ""), 220),
        catalog: CATALOGS.has(catalog) ? catalog : "",
        gameSlug,
        visibility: VISIBILITIES.has(raw.visibility) ? raw.visibility : "public",
        featured: raw.featured === true,
        newLabel: raw.newLabel === true,
        updatedLabel: raw.updatedLabel === true,
        trendingLabel: raw.trendingLabel === true,
        priority: Number.isFinite(Number(raw.priority)) ? Math.max(MIN_PRIORITY, Math.min(MAX_PRIORITY, Math.trunc(Number(raw.priority)))) : 0,
        maintenanceMessage: normalizeMessage(raw.maintenanceMessage, 500),
        launchDisabled: raw.launchDisabled === true,
        adminNote: normalizeMessage(raw.adminNote, 1000),
        updatedBy: normalizeEmail(raw.updatedBy) || "",
        updatedAt: toIsoDate(raw.updatedAt) || normalizeText(raw.updatedAt, 40),
        createdAt: toIsoDate(raw.createdAt) || normalizeText(raw.createdAt, 40)
    };
}

function publicOverride(raw = {}) {
    const item = normalizeOverride(raw);
    return {
        catalog: item.catalog,
        gameSlug: item.gameSlug,
        visibility: item.visibility,
        featured: item.featured,
        newLabel: item.newLabel,
        updatedLabel: item.updatedLabel,
        trendingLabel: item.trendingLabel,
        priority: item.priority,
        maintenanceMessage: item.maintenanceMessage,
        launchDisabled: item.launchDisabled,
        updatedAt: item.updatedAt
    };
}

function normalizeFlag(raw = {}) {
    const known = KNOWN_FEATURE_FLAGS[normalizeText(raw.key, 100)];
    if (!known) {
        throw new CatalogOperationsError(400, "UNKNOWN_FEATURE_FLAG", "Unknown feature flag.");
    }
    return {
        ...known,
        enabled: typeof raw.enabled === "boolean" ? raw.enabled : known.enabled,
        description: normalizeMessage(raw.description || known.description, 500),
        scope: known.scope,
        gameSlug: normalizeText(raw.gameSlug, 160),
        updatedBy: normalizeEmail(raw.updatedBy) || "",
        updatedAt: toIsoDate(raw.updatedAt) || normalizeText(raw.updatedAt, 40)
    };
}

function normalizeConfig(raw = {}) {
    return {
        globalBannerEnabled: raw.globalBannerEnabled === true,
        globalBannerMessage: normalizeMessage(raw.globalBannerMessage, 500),
        globalMaintenanceMode: raw.globalMaintenanceMode === true,
        globalMaintenanceMessage: normalizeMessage(raw.globalMaintenanceMessage, 500),
        updatedBy: normalizeEmail(raw.updatedBy) || "",
        updatedAt: toIsoDate(raw.updatedAt) || normalizeText(raw.updatedAt, 40),
        createdAt: toIsoDate(raw.createdAt) || normalizeText(raw.createdAt, 40)
    };
}

function defaultFlags() {
    return Object.values(KNOWN_FEATURE_FLAGS).map((flag) => normalizeFlag(flag));
}

function publicConfig(config, flags) {
    const flagItems = Array.isArray(flags) && flags.length ? flags : defaultFlags();
    return {
        ok: true,
        config: normalizeConfig(config || DEFAULT_CONFIG),
        featureFlags: Object.fromEntries(flagItems.map((flag) => [flag.key, flag.enabled === true]))
    };
}

function parseJson(value) {
    try {
        return value ? JSON.parse(value) : null;
    } catch (_) {
        return null;
    }
}

function isServiceAccountCredential(value) {
    return Boolean(value && typeof value === "object" && value.project_id && value.client_email && value.private_key);
}

async function readJsonFile(filePath) {
    if (!filePath) {
        return null;
    }
    try {
        const parsed = parseJson(await fs.readFile(filePath, "utf8"));
        return isServiceAccountCredential(parsed) ? parsed : null;
    } catch (_) {
        return null;
    }
}

async function readServiceAccount(rootDir) {
    const inline = parseJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (isServiceAccountCredential(inline)) {
        return inline;
    }

    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
        ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")
        : "";
    const parsedBase64 = parseJson(base64);
    if (isServiceAccountCredential(parsedBase64)) {
        return parsedBase64;
    }

    const candidates = [
        process.env.FIREBASE_SERVICE_ACCOUNT_FILE,
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
        process.env.GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT,
        process.env.GOOGLE_APPLICATION_CREDENTIALS,
        path.join(rootDir, "premium", "firebase_credentials", "serviceAccount.json")
    ].filter(Boolean);

    for (const candidate of candidates) {
        const resolved = path.isAbsolute(candidate) ? candidate : path.resolve(rootDir, candidate);
        const credential = await readJsonFile(resolved);
        if (credential) {
            return credential;
        }
    }

    return null;
}

async function getFirestoreState(rootDir) {
    if (cachedState) {
        return cachedState;
    }
    try {
        const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
        const { getFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";
        if (!serviceAccount && !allowApplicationDefault) {
            cachedState = { enabled: false, db: null, mode: "disabled" };
            return cachedState;
        }
        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-catalog-operations";
        const existingApp = getApps().find((app) => app.name === appName);
        const app = existingApp || initializeApp(
            serviceAccount
                ? { credential: cert(serviceAccount), projectId }
                : { credential: applicationDefault(), projectId },
            appName
        );
        cachedState = {
            enabled: true,
            db: getFirestore(app),
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedState = {
            enabled: false,
            db: null,
            mode: "error",
            error: error?.message || "Firebase Admin initialization failed."
        };
    }
    return cachedState;
}

async function createLocalAdapter(rootDir) {
    const dir = path.join(rootDir, LOCAL_OPERATIONS_DIR);
    const file = path.join(dir, LOCAL_OPERATIONS_FILE);

    async function readData() {
        try {
            const parsed = JSON.parse(await fs.readFile(file, "utf8"));
            return {
                overrides: parsed?.overrides && typeof parsed.overrides === "object" ? parsed.overrides : {},
                featureFlags: parsed?.featureFlags && typeof parsed.featureFlags === "object" ? parsed.featureFlags : {},
                config: parsed?.config && typeof parsed.config === "object" ? parsed.config : DEFAULT_CONFIG
            };
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Catalog operations local store could not be read:", error?.message || error);
            }
            return { overrides: {}, featureFlags: {}, config: DEFAULT_CONFIG };
        }
    }

    async function writeData(data) {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    }

    return {
        mode: "local",
        async readAll() {
            const data = await readData();
            const flagMap = { ...KNOWN_FEATURE_FLAGS, ...data.featureFlags };
            return {
                overrides: Object.values(data.overrides).map(normalizeOverride),
                featureFlags: Object.values(flagMap).map(normalizeFlag),
                config: normalizeConfig(data.config)
            };
        },
        async getOverride(catalog, slug) {
            const data = await readData();
            const item = data.overrides[overrideKey(catalog, slug)];
            return item ? normalizeOverride(item) : null;
        },
        async saveOverride(item) {
            const data = await readData();
            const stored = normalizeOverride(item);
            data.overrides[overrideKey(stored.catalog, stored.gameSlug)] = stored;
            await writeData(data);
            return stored;
        },
        async getFlag(key) {
            const data = await readData();
            return normalizeFlag({ ...KNOWN_FEATURE_FLAGS[key], ...(data.featureFlags[key] || {}) });
        },
        async saveFlag(flag) {
            const data = await readData();
            const stored = normalizeFlag(flag);
            data.featureFlags[stored.key] = stored;
            await writeData(data);
            return stored;
        },
        async getConfig() {
            return normalizeConfig((await readData()).config);
        },
        async saveConfig(config) {
            const data = await readData();
            data.config = normalizeConfig(config);
            await writeData(data);
            return data.config;
        }
    };
}

async function createFirestoreAdapter(rootDir, { publicRead = false } = {}) {
    const state = await getFirestoreState(rootDir);
    if (!state.enabled || !state.db) {
        if (IS_PRODUCTION && !publicRead) {
            throw new CatalogOperationsError(503, "CATALOG_OPERATIONS_STORAGE_NOT_CONFIGURED", "Catalog operations storage is not configured.");
        }
        if (IS_PRODUCTION && publicRead) {
            return null;
        }
        return createLocalAdapter(rootDir);
    }

    const overrideCollection = state.db.collection(OVERRIDES_COLLECTION);
    const flagCollection = state.db.collection(FEATURE_FLAGS_COLLECTION);
    const configRef = state.db.collection(OPERATIONS_CONFIG_COLLECTION).doc(OPERATIONS_CONFIG_DOC);
    return {
        mode: state.mode,
        async readAll() {
            const [overrideSnapshot, flagSnapshot, configSnapshot] = await Promise.all([
                overrideCollection.limit(500).get(),
                flagCollection.limit(50).get(),
                configRef.get()
            ]);
            const storedFlags = Object.fromEntries(flagSnapshot.docs.map((doc) => [doc.id, doc.data()]));
            const flagMap = { ...KNOWN_FEATURE_FLAGS, ...storedFlags };
            return {
                overrides: overrideSnapshot.docs.map((doc) => normalizeOverride({ id: doc.id, ...doc.data() })),
                featureFlags: Object.values(flagMap).map(normalizeFlag),
                config: normalizeConfig(configSnapshot.exists ? configSnapshot.data() : DEFAULT_CONFIG)
            };
        },
        async getOverride(catalog, slug) {
            const snapshot = await overrideCollection.doc(overrideKey(catalog, slug)).get();
            return snapshot.exists ? normalizeOverride({ id: snapshot.id, ...snapshot.data() }) : null;
        },
        async saveOverride(item) {
            const stored = normalizeOverride(item);
            await overrideCollection.doc(overrideKey(stored.catalog, stored.gameSlug)).set(stored, { merge: true });
            return stored;
        },
        async getFlag(key) {
            const snapshot = await flagCollection.doc(key).get();
            return normalizeFlag({ ...KNOWN_FEATURE_FLAGS[key], ...(snapshot.exists ? snapshot.data() : {}) });
        },
        async saveFlag(flag) {
            const stored = normalizeFlag(flag);
            await flagCollection.doc(stored.key).set(stored, { merge: true });
            return stored;
        },
        async getConfig() {
            const snapshot = await configRef.get();
            return normalizeConfig(snapshot.exists ? snapshot.data() : DEFAULT_CONFIG);
        },
        async saveConfig(config) {
            const stored = normalizeConfig(config);
            await configRef.set(stored, { merge: true });
            return stored;
        }
    };
}

function applyOverrideToGame(game, override = null, catalog = "public") {
    const visibility = override?.visibility || "public";
    const launchDisabled = override?.launchDisabled === true
        || visibility === "coming_soon"
        || visibility === "maintenance";
    const operationStatus = {
        catalog,
        visibility,
        featured: override?.featured === true,
        newLabel: override?.newLabel === true,
        updatedLabel: override?.updatedLabel === true,
        trendingLabel: override?.trendingLabel === true,
        priority: Number.isFinite(Number(override?.priority)) ? Number(override.priority) : 0,
        launchDisabled,
        maintenanceMessage: normalizeMessage(override?.maintenanceMessage, 500),
        unavailableReason: visibility === "maintenance"
            ? "maintenance"
            : visibility === "coming_soon"
                ? "coming_soon"
                : visibility === "hidden"
                    ? "hidden"
                    : launchDisabled
                        ? "launch_disabled"
                        : "",
        updatedAt: normalizeText(override?.updatedAt, 40)
    };
    return {
        ...game,
        catalog,
        visibility,
        featured: operationStatus.featured,
        newLabel: operationStatus.newLabel,
        updatedLabel: operationStatus.updatedLabel,
        trendingLabel: operationStatus.trendingLabel,
        priority: operationStatus.priority,
        launchDisabled,
        maintenanceMessage: operationStatus.maintenanceMessage,
        operationStatus
    };
}

function sortCatalogGames(games = []) {
    return [...games].sort((left, right) => {
        const priorityDelta = Number(right.priority || 0) - Number(left.priority || 0);
        if (priorityDelta) {
            return priorityDelta;
        }
        const orderDelta = Number(left.order || 0) - Number(right.order || 0);
        if (orderDelta) {
            return orderDelta;
        }
        return String(left.name || left.title || left.id).localeCompare(String(right.name || right.title || right.id));
    }).map((game, index) => ({ ...game, order: index }));
}

function mergeCatalogGames(baseGames = [], overrides = [], catalog = "public", options = {}) {
    const overrideMap = new Map(overrides
        .filter((item) => item.catalog === catalog)
        .map((item) => [item.gameSlug, item]));
    const merged = baseGames.map((game) => applyOverrideToGame(game, overrideMap.get(String(game.id || "").toLowerCase()), catalog));
    const filtered = options.includeUnavailable ? merged : merged.filter((game) => game.visibility !== "hidden");
    return sortCatalogGames(filtered);
}

function safeAdminGame(baseGame = {}, override = null, catalog = "public", analytics = null, feedback = null) {
    const merged = applyOverrideToGame(baseGame, override, catalog);
    return {
        slug: merged.id,
        catalog,
        title: merged.name || merged.title || merged.id,
        category: merged.category || "",
        tags: Array.isArray(merged.tags) ? merged.tags.slice(0, 8) : [],
        thumbnail: merged.thumbnail || "",
        route: merged.preferredEntry || merged.path || "",
        baseStatus: baseGame.visible === false ? "hidden" : "available",
        visibility: merged.visibility,
        featured: merged.featured,
        newLabel: merged.newLabel,
        updatedLabel: merged.updatedLabel,
        trendingLabel: merged.trendingLabel,
        priority: merged.priority,
        launchDisabled: merged.launchDisabled,
        maintenanceMessage: merged.maintenanceMessage,
        adminNote: normalizeMessage(override?.adminNote, 1000),
        analyticsSummary: analytics || null,
        feedbackSummary: feedback || null,
        updatedAt: normalizeText(override?.updatedAt, 40)
    };
}

function createCatalogOperationsStore(rootDir) {
    let adapterPromise = null;
    let publicAdapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirestoreAdapter(rootDir);
        }
        return adapterPromise;
    }

    async function getPublicAdapter() {
        if (!publicAdapterPromise) {
            publicAdapterPromise = createFirestoreAdapter(rootDir, { publicRead: true });
        }
        return publicAdapterPromise;
    }

    async function getAll({ publicRead = false } = {}) {
        const adapter = publicRead ? await getPublicAdapter() : await getAdapter();
        if (!adapter) {
            return {
                overrides: [],
                featureFlags: defaultFlags(),
                config: normalizeConfig(DEFAULT_CONFIG),
                storageMode: "disabled"
            };
        }
        return {
            ...(await adapter.readAll()),
            storageMode: adapter.mode
        };
    }

    async function updateOverride(catalog, slug, patch, adminEmail) {
        const adapter = await getAdapter();
        const now = new Date().toISOString();
        const before = await adapter.getOverride(catalog, slug);
        const next = normalizeOverride({
            ...(before || {
                id: overrideKey(catalog, slug),
                catalog,
                gameSlug: slug,
                visibility: "public",
                createdAt: now
            }),
            ...patch,
            catalog,
            gameSlug: slug,
            updatedBy: adminEmail,
            updatedAt: now,
            createdAt: before?.createdAt || now
        });
        const after = await adapter.saveOverride(next);
        return { before, after, storageMode: adapter.mode };
    }

    return {
        async ensureAvailable() {
            const adapter = await getAdapter();
            return { ok: true, storageMode: adapter.mode };
        },
        async readPublicState() {
            const data = await getAll({ publicRead: true });
            return {
                ...data,
                publicConfig: publicConfig(data.config, data.featureFlags)
            };
        },
        async listFeatureFlags() {
            const data = await getAll();
            return { items: data.featureFlags, storageMode: data.storageMode };
        },
        async updateFeatureFlag(key, input = {}, adminEmail = "") {
            const safeKey = normalizeText(key, 100);
            if (!KNOWN_FEATURE_FLAGS[safeKey]) {
                throw new CatalogOperationsError(400, "UNKNOWN_FEATURE_FLAG", "Unknown feature flag.");
            }
            const reason = requireReason(input.reason);
            const adapter = await getAdapter();
            const before = await adapter.getFlag(safeKey);
            const after = await adapter.saveFlag({
                ...before,
                enabled: input.enabled === true,
                description: Object.prototype.hasOwnProperty.call(input, "description")
                    ? normalizeMessage(input.description, 500)
                    : before.description,
                updatedBy: adminEmail,
                updatedAt: new Date().toISOString()
            });
            return { before, after, reason, storageMode: adapter.mode };
        },
        async getConfig({ publicRead = false } = {}) {
            const data = await getAll({ publicRead });
            return {
                config: data.config,
                publicConfig: publicConfig(data.config, data.featureFlags),
                storageMode: data.storageMode
            };
        },
        async updateConfig(input = {}, adminEmail = "") {
            const reason = requireReason(input.reason);
            if (input.globalMaintenanceMode === true || input.globalBannerEnabled === true) {
                requireConfirmation(input.confirmed);
            }
            const adapter = await getAdapter();
            const before = await adapter.getConfig();
            const now = new Date().toISOString();
            const after = await adapter.saveConfig({
                ...before,
                ...(Object.prototype.hasOwnProperty.call(input, "globalBannerEnabled") ? { globalBannerEnabled: input.globalBannerEnabled === true } : {}),
                ...(Object.prototype.hasOwnProperty.call(input, "globalBannerMessage") ? { globalBannerMessage: normalizeMessage(input.globalBannerMessage, 500) } : {}),
                ...(Object.prototype.hasOwnProperty.call(input, "globalMaintenanceMode") ? { globalMaintenanceMode: input.globalMaintenanceMode === true } : {}),
                ...(Object.prototype.hasOwnProperty.call(input, "globalMaintenanceMessage") ? { globalMaintenanceMessage: normalizeMessage(input.globalMaintenanceMessage, 500) } : {}),
                updatedBy: adminEmail,
                updatedAt: now,
                createdAt: before.createdAt || now
            });
            return { before, after, reason, storageMode: adapter.mode };
        },
        async listOverrides() {
            const data = await getAll();
            return {
                items: data.overrides,
                storageMode: data.storageMode
            };
        },
        async updateVisibility({ catalog, slug, input = {}, adminEmail = "" }) {
            const safeCatalog = normalizeCatalog(catalog);
            const safeSlug = normalizeSlug(slug);
            const reason = requireReason(input.reason);
            const visibility = normalizeVisibility(input.visibility);
            const launchDisabled = Object.prototype.hasOwnProperty.call(input, "launchDisabled")
                ? input.launchDisabled === true
                : (visibility === "coming_soon" || visibility === "maintenance");
            if (visibility !== "public" || launchDisabled) {
                requireConfirmation(input.confirmed);
            }
            const result = await updateOverride(safeCatalog, safeSlug, {
                visibility,
                launchDisabled,
                maintenanceMessage: normalizeMessage(input.maintenanceMessage, 500)
            }, normalizeEmail(adminEmail));
            return { ...result, reason };
        },
        async updateLabels({ catalog, slug, input = {}, adminEmail = "" }) {
            const reason = requireReason(input.reason);
            const patch = {};
            ["featured", "newLabel", "updatedLabel", "trendingLabel"].forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(input, key)) {
                    patch[key] = input[key] === true;
                }
            });
            const result = await updateOverride(normalizeCatalog(catalog), normalizeSlug(slug), patch, normalizeEmail(adminEmail));
            return { ...result, reason };
        },
        async updatePriority({ catalog, slug, input = {}, adminEmail = "" }) {
            const reason = requireReason(input.reason);
            const result = await updateOverride(normalizeCatalog(catalog), normalizeSlug(slug), {
                priority: normalizePriority(input.priority)
            }, normalizeEmail(adminEmail));
            return { ...result, reason };
        },
        async updateNote({ catalog, slug, input = {}, adminEmail = "" }) {
            const reason = requireReason(input.reason);
            const result = await updateOverride(normalizeCatalog(catalog), normalizeSlug(slug), {
                adminNote: normalizeMessage(input.adminNote, 1000)
            }, normalizeEmail(adminEmail));
            return { ...result, reason };
        }
    };
}

module.exports = {
    CatalogOperationsError,
    KNOWN_FEATURE_FLAGS,
    createCatalogOperationsStore,
    mergeCatalogGames,
    normalizeCatalog,
    normalizeSlug,
    publicConfig,
    publicOverride,
    safeAdminGame
};
