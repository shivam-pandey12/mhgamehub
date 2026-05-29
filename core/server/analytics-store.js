const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const LOCAL_ANALYTICS_DIR = ".gamehub-data";
const LOCAL_ANALYTICS_FILE = "analytics.json";
const LOCAL_DEV_FALLBACK = process.env.NODE_ENV !== "production";
const MAX_RECENT_EVENTS = 2500;
const ADMIN_EVENT_READ_LIMIT = 500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 180;

const COLLECTIONS = {
    events: "analyticsEvents",
    daily: "analyticsDailyStats",
    totals: "analyticsTotals",
    games: "gameStats",
    sources: "sourceStats"
};

const ALLOWED_EVENT_TYPES = new Set(["page_view", "game_view", "game_play_start"]);
const ALLOWED_DEVICE_TYPES = new Set(["desktop", "mobile", "tablet"]);
const KNOWN_SOURCES = new Set([
    "direct",
    "google",
    "youtube",
    "instagram",
    "facebook",
    "whatsapp",
    "github",
    "bing",
    "twitter",
    "other"
]);

const rateBuckets = new Map();
let cachedFirestoreState = null;

class AnalyticsError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "AnalyticsError";
        this.status = status;
        this.code = code;
    }
}

function normalizeText(value, maxLength = 240) {
    return String(value ?? "")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function normalizeEmail(value) {
    const email = normalizeText(value, 180).toLowerCase();
    if (!email) {
        return "";
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizeSlug(value) {
    return normalizeText(value, 140)
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 140);
}

function normalizePath(value) {
    const raw = normalizeText(value, 320);
    if (!raw) {
        return "/";
    }
    const withoutOrigin = raw.replace(/^https?:\/\/[^/]+/i, "");
    return withoutOrigin.startsWith("/") ? withoutOrigin : `/${withoutOrigin}`;
}

function normalizeEventType(value) {
    const eventType = normalizeText(value, 40).toLowerCase();
    if (!ALLOWED_EVENT_TYPES.has(eventType)) {
        throw new AnalyticsError(400, "INVALID_ANALYTICS_EVENT_TYPE", "Invalid analytics event type.");
    }
    return eventType;
}

function normalizeDeviceType(value) {
    const deviceType = normalizeText(value, 40).toLowerCase();
    return ALLOWED_DEVICE_TYPES.has(deviceType) ? deviceType : "desktop";
}

function getReferrerDomain(value) {
    const referrer = normalizeText(value, 320);
    if (!referrer) {
        return "";
    }
    try {
        return new URL(referrer).hostname.replace(/^www\./i, "").toLowerCase().slice(0, 180);
    } catch (_) {
        return "";
    }
}

function mapSource(value, referrerDomain = "") {
    const raw = normalizeText(value, 80).toLowerCase();
    const candidate = raw || normalizeText(referrerDomain, 180).toLowerCase();
    if (!candidate) {
        return "direct";
    }
    if (candidate.includes("google")) {
        return "google";
    }
    if (candidate.includes("youtu")) {
        return "youtube";
    }
    if (candidate.includes("instagram")) {
        return "instagram";
    }
    if (candidate.includes("facebook") || candidate === "fb") {
        return "facebook";
    }
    if (candidate.includes("whatsapp") || candidate === "wa") {
        return "whatsapp";
    }
    if (candidate.includes("github")) {
        return "github";
    }
    if (candidate.includes("bing")) {
        return "bing";
    }
    if (candidate.includes("twitter") || candidate === "x" || candidate.includes("t.co")) {
        return "twitter";
    }
    if (candidate === "direct" || candidate === "none") {
        return "direct";
    }
    return KNOWN_SOURCES.has(candidate) ? candidate : "other";
}

function normalizeMetadata(value) {
    const metadata = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const safe = {};
    for (const [rawKey, rawValue] of Object.entries(metadata).slice(0, 20)) {
        const key = normalizeText(rawKey, 60).replace(/[^a-zA-Z0-9_-]+/g, "_");
        if (!key) {
            continue;
        }
        if (typeof rawValue === "boolean") {
            safe[key] = rawValue;
        } else if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
            safe[key] = rawValue;
        } else if (typeof rawValue === "string") {
            safe[key] = normalizeText(rawValue, 180);
        }
    }
    return safe;
}

function isAdminTraffic(pathValue, metadata, input) {
    return Boolean(
        input?.isAdminTraffic === true
        || metadata.isAdminTraffic === true
        || normalizePath(pathValue).startsWith("/admin")
    );
}

function isLikelyBot(userAgent) {
    const ua = normalizeText(userAgent, 260).toLowerCase();
    if (!ua) {
        return false;
    }
    return /(bot|crawler|spider|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget)/i.test(ua);
}

function hashValue(value) {
    return crypto
        .createHash("sha256")
        .update(String(value || "unknown"))
        .digest("hex");
}

function getRequestIp(req) {
    const forwarded = String(req?.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
    return forwarded || String(req?.socket?.remoteAddress || req?.ip || "").trim();
}

function buildAnalyticsRequesterHash(req, anonymousSessionId = "") {
    const raw = `${getRequestIp(req)}|${normalizeText(anonymousSessionId, 140) || "anonymous"}`;
    return hashValue(raw).slice(0, 32);
}

function enforceRateLimit(rateKey, eventType) {
    const key = `${String(rateKey || "anonymous")}:${String(eventType || "event")}`;
    const now = Date.now();
    const current = rateBuckets.get(key) || [];
    const recent = current.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
        rateBuckets.set(key, recent);
        throw new AnalyticsError(429, "ANALYTICS_RATE_LIMITED", "Too many analytics events.");
    }
    recent.push(now);
    rateBuckets.set(key, recent);

    if (rateBuckets.size > 8000) {
        for (const [bucketKey, timestamps] of rateBuckets.entries()) {
            if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
                rateBuckets.delete(bucketKey);
            }
        }
    }
}

function makeId() {
    return `an_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
}

function dayKeyFromDate(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

function defaultTotals() {
    return {
        totalViews: 0,
        totalGameViews: 0,
        totalGamePlays: 0,
        uniqueSessionsApprox: null,
        bySource: {},
        byDevice: {},
        updatedAt: null
    };
}

function defaultDaily(dayKey) {
    return {
        dayKey,
        totalPageViews: 0,
        totalGameViews: 0,
        totalGamePlays: 0,
        adminPageViews: 0,
        uniqueSessionsApprox: null,
        bySource: {},
        byDevice: {},
        updatedAt: null
    };
}

function safeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function incrementObjectValue(target, key, amount = 1) {
    if (!key) {
        return;
    }
    target[key] = safeNumber(target[key]) + amount;
}

function normalizeEventInput(input = {}, context = {}) {
    const eventType = normalizeEventType(input.eventType);
    const metadata = normalizeMetadata(input.metadata);
    const pathValue = normalizePath(input.path);
    const referrerDomain = getReferrerDomain(input.referrer);
    const source = mapSource(input.source, referrerDomain);
    const now = context.now || new Date().toISOString();
    const dayKey = dayKeyFromDate(new Date(now));
    const verifiedSession = context.verifiedSession || null;

    return {
        id: makeId(),
        eventType,
        path: pathValue,
        title: normalizeText(input.title, 180),
        gameSlug: normalizeSlug(input.gameSlug),
        gameTitle: normalizeText(input.gameTitle, 180),
        source,
        medium: normalizeText(input.medium, 80).toLowerCase(),
        campaign: normalizeText(input.campaign, 120),
        referrerDomain,
        deviceType: normalizeDeviceType(input.deviceType),
        anonymousSessionId: normalizeText(input.anonymousSessionId, 140),
        verifiedUserEmail: normalizeEmail(verifiedSession?.email) || null,
        verifiedUserId: normalizeText(verifiedSession?.uid, 140) || null,
        isAdminTraffic: isAdminTraffic(pathValue, metadata, input),
        metadata,
        createdAt: now,
        dayKey,
        requestKeyHash: normalizeText(context.requestKeyHash, 80)
    };
}

function safeAnalyticsEvent(item) {
    return {
        id: normalizeText(item.id, 80),
        eventType: ALLOWED_EVENT_TYPES.has(item.eventType) ? item.eventType : "page_view",
        path: normalizePath(item.path),
        title: normalizeText(item.title, 180),
        gameSlug: normalizeSlug(item.gameSlug),
        gameTitle: normalizeText(item.gameTitle, 180),
        source: mapSource(item.source),
        medium: normalizeText(item.medium, 80).toLowerCase(),
        campaign: normalizeText(item.campaign, 120),
        referrerDomain: normalizeText(item.referrerDomain, 180).toLowerCase(),
        deviceType: normalizeDeviceType(item.deviceType),
        anonymousSessionId: normalizeText(item.anonymousSessionId, 140),
        verifiedUserEmail: normalizeEmail(item.verifiedUserEmail) || null,
        verifiedUserId: normalizeText(item.verifiedUserId, 140) || null,
        isAdminTraffic: item.isAdminTraffic === true,
        metadata: normalizeMetadata(item.metadata),
        createdAt: normalizeText(item.createdAt, 40),
        dayKey: normalizeText(item.dayKey, 20)
    };
}

function storageAnalyticsEvent(item) {
    return {
        ...safeAnalyticsEvent(item),
        requestKeyHash: normalizeText(item.requestKeyHash, 80)
    };
}

function safeDailyStats(item, fallbackDayKey = "") {
    const dayKey = normalizeText(item?.dayKey || fallbackDayKey, 20);
    return {
        dayKey,
        totalPageViews: safeNumber(item?.totalPageViews),
        totalGameViews: safeNumber(item?.totalGameViews),
        totalGamePlays: safeNumber(item?.totalGamePlays),
        adminPageViews: safeNumber(item?.adminPageViews),
        uniqueSessionsApprox: null,
        bySource: sanitizeCountMap(item?.bySource),
        byDevice: sanitizeCountMap(item?.byDevice),
        updatedAt: normalizeText(item?.updatedAt, 40) || null
    };
}

function sanitizeCountMap(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const safe = {};
    for (const [key, count] of Object.entries(source)) {
        const safeKey = normalizeText(key, 80).replace(/[^a-zA-Z0-9_-]+/g, "_");
        if (safeKey) {
            safe[safeKey] = safeNumber(count);
        }
    }
    return safe;
}

function getTopKey(counts = {}) {
    return Object.entries(sanitizeCountMap(counts))
        .sort((left, right) => right[1] - left[1])
        .map(([key]) => key)[0] || "";
}

function safeGameStats(item) {
    const bySource = sanitizeCountMap(item?.bySource);
    return {
        gameSlug: normalizeSlug(item?.gameSlug),
        gameTitle: normalizeText(item?.gameTitle, 180),
        totalViews: safeNumber(item?.totalViews),
        totalPlays: safeNumber(item?.totalPlays),
        todayViews: safeNumber(item?.todayViews),
        todayPlays: safeNumber(item?.todayPlays),
        todayDayKey: normalizeText(item?.todayDayKey, 20),
        lastViewedAt: normalizeText(item?.lastViewedAt, 40) || null,
        lastPlayedAt: normalizeText(item?.lastPlayedAt, 40) || null,
        topSource: getTopKey(bySource),
        bySource,
        updatedAt: normalizeText(item?.updatedAt, 40) || null
    };
}

function safeSourceStats(item) {
    return {
        source: mapSource(item?.source),
        totalViews: safeNumber(item?.totalViews),
        totalGameViews: safeNumber(item?.totalGameViews),
        totalGamePlays: safeNumber(item?.totalGamePlays),
        updatedAt: normalizeText(item?.updatedAt, 40) || null
    };
}

function ensureLocalShape(data) {
    const next = data && typeof data === "object" ? data : {};
    return {
        events: Array.isArray(next.events) ? next.events.map(storageAnalyticsEvent) : [],
        dailyStats: next.dailyStats && typeof next.dailyStats === "object" ? next.dailyStats : {},
        gameStats: next.gameStats && typeof next.gameStats === "object" ? next.gameStats : {},
        sourceStats: next.sourceStats && typeof next.sourceStats === "object" ? next.sourceStats : {},
        totals: {
            ...defaultTotals(),
            ...(next.totals && typeof next.totals === "object" ? next.totals : {})
        }
    };
}

function applyEventToLocalAggregates(data, event) {
    const publicEvent = !event.isAdminTraffic;
    const daily = safeDailyStats(data.dailyStats[event.dayKey] || defaultDaily(event.dayKey), event.dayKey);
    const totals = {
        ...defaultTotals(),
        ...data.totals,
        bySource: sanitizeCountMap(data.totals?.bySource),
        byDevice: sanitizeCountMap(data.totals?.byDevice)
    };

    daily.updatedAt = event.createdAt;
    totals.updatedAt = event.createdAt;

    if (event.isAdminTraffic && event.eventType === "page_view") {
        daily.adminPageViews += 1;
    }

    if (publicEvent) {
        if (event.eventType === "page_view") {
            daily.totalPageViews += 1;
            totals.totalViews += 1;
            incrementObjectValue(daily.bySource, event.source);
            incrementObjectValue(daily.byDevice, event.deviceType);
            incrementObjectValue(totals.bySource, event.source);
            incrementObjectValue(totals.byDevice, event.deviceType);
        }
        if (event.eventType === "game_view") {
            daily.totalGameViews += 1;
            totals.totalGameViews += 1;
        }
        if (event.eventType === "game_play_start") {
            daily.totalGamePlays += 1;
            totals.totalGamePlays += 1;
        }
    }

    data.dailyStats[event.dayKey] = daily;
    data.totals = totals;

    if (publicEvent) {
        const sourceStats = safeSourceStats(data.sourceStats[event.source] || { source: event.source });
        sourceStats.updatedAt = event.createdAt;
        if (event.eventType === "page_view") {
            sourceStats.totalViews += 1;
        }
        if (event.eventType === "game_view") {
            sourceStats.totalGameViews += 1;
        }
        if (event.eventType === "game_play_start") {
            sourceStats.totalGamePlays += 1;
        }
        data.sourceStats[event.source] = sourceStats;
    }

    if (publicEvent && event.gameSlug && (event.eventType === "game_view" || event.eventType === "game_play_start")) {
        const existing = safeGameStats(data.gameStats[event.gameSlug] || {
            gameSlug: event.gameSlug,
            gameTitle: event.gameTitle
        });
        if (existing.todayDayKey !== event.dayKey) {
            existing.todayViews = 0;
            existing.todayPlays = 0;
            existing.todayDayKey = event.dayKey;
        }
        existing.gameTitle = event.gameTitle || existing.gameTitle || event.gameSlug;
        existing.updatedAt = event.createdAt;
        incrementObjectValue(existing.bySource, event.source);
        if (event.eventType === "game_view") {
            existing.totalViews += 1;
            existing.todayViews += 1;
            existing.lastViewedAt = event.createdAt;
        }
        if (event.eventType === "game_play_start") {
            existing.totalPlays += 1;
            existing.todayPlays += 1;
            existing.lastPlayedAt = event.createdAt;
        }
        existing.topSource = getTopKey(existing.bySource);
        data.gameStats[event.gameSlug] = existing;
    }
}

function sortGames(items, sort = "plays") {
    const sortKey = normalizeText(sort, 40);
    const field = {
        views: "totalViews",
        plays: "totalPlays",
        todayViews: "todayViews",
        todayPlays: "todayPlays",
        recent: "updatedAt"
    }[sortKey] || "totalPlays";

    return [...items].sort((left, right) => {
        if (field === "updatedAt") {
            return String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""));
        }
        return safeNumber(right[field]) - safeNumber(left[field]);
    });
}

function paginate(items, filters = {}) {
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
    const cursor = normalizeText(filters.cursor, 100);
    let startIndex = 0;
    if (cursor) {
        const index = items.findIndex((item) => item.id === cursor);
        startIndex = index >= 0 ? index + 1 : 0;
    }
    const page = items.slice(startIndex, startIndex + limit);
    const nextCursor = startIndex + limit < items.length ? page[page.length - 1]?.id || null : null;
    return { page, nextCursor };
}

function filterEvents(items, filters = {}) {
    const eventType = normalizeText(filters.eventType, 40).toLowerCase();
    const gameSlug = normalizeSlug(filters.gameSlug);
    const source = filters.source ? mapSource(filters.source) : "";

    return items.filter((item) => {
        if (eventType && ALLOWED_EVENT_TYPES.has(eventType) && item.eventType !== eventType) {
            return false;
        }
        if (gameSlug && item.gameSlug !== gameSlug) {
            return false;
        }
        if (source && item.source !== source) {
            return false;
        }
        return true;
    });
}

function sourceActivity(source) {
    return safeNumber(source.totalViews) + safeNumber(source.totalGameViews) + safeNumber(source.totalGamePlays);
}

function buildOverviewFromLocal(data) {
    const todayKey = dayKeyFromDate();
    const today = safeDailyStats(data.dailyStats[todayKey] || defaultDaily(todayKey), todayKey);
    const daily = Object.values(data.dailyStats)
        .map((item) => safeDailyStats(item))
        .sort((left, right) => String(left.dayKey).localeCompare(String(right.dayKey)))
        .slice(-14);
    const games = Object.values(data.gameStats).map(safeGameStats);
    const sources = Object.values(data.sourceStats)
        .map(safeSourceStats)
        .sort((left, right) => sourceActivity(right) - sourceActivity(left));
    const totals = {
        ...defaultTotals(),
        ...data.totals,
        bySource: sanitizeCountMap(data.totals.bySource),
        byDevice: sanitizeCountMap(data.totals.byDevice)
    };
    const topByViews = sortGames(games, "views")[0] || null;
    const topByPlays = sortGames(games, "plays")[0] || null;
    const topSource = sources[0]?.source || "";

    return {
        totals: {
            totalViews: safeNumber(totals.totalViews),
            todayViews: today.totalPageViews,
            totalGameViews: safeNumber(totals.totalGameViews),
            todayGameViews: today.totalGameViews,
            totalGamePlays: safeNumber(totals.totalGamePlays),
            todayGamePlays: today.totalGamePlays,
            uniqueSessionsApprox: null,
            topSource,
            topGameByViews: topByViews,
            topGameByPlays: topByPlays
        },
        daily,
        bySource: sources.slice(0, 20),
        byDevice: Object.entries(totals.byDevice).map(([deviceType, count]) => ({
            deviceType,
            count
        })).sort((left, right) => right.count - left.count)
    };
}

function isServiceAccountCredential(value) {
    return Boolean(value && typeof value === "object" && value.project_id && value.client_email && value.private_key);
}

function parseJson(value) {
    try {
        return value ? JSON.parse(value) : null;
    } catch (_) {
        return null;
    }
}

async function readJsonFile(filePath) {
    if (!filePath) {
        return null;
    }
    try {
        const source = await fs.readFile(filePath, "utf8");
        const parsed = parseJson(source);
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

async function getFirestore(rootDir) {
    if (cachedFirestoreState) {
        return cachedFirestoreState;
    }

    try {
        const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
        const { FieldValue, getFirestore: getAdminFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";

        if (!serviceAccount && !allowApplicationDefault) {
            cachedFirestoreState = { enabled: false, db: null, FieldValue: null, mode: "disabled" };
            return cachedFirestoreState;
        }

        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-analytics-admin";
        const existingApp = getApps().find((app) => app.name === appName);
        const app = existingApp || initializeApp(
            serviceAccount
                ? { credential: cert(serviceAccount), projectId }
                : { credential: applicationDefault(), projectId },
            appName
        );

        cachedFirestoreState = {
            enabled: true,
            db: getAdminFirestore(app),
            FieldValue,
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedFirestoreState = {
            enabled: false,
            db: null,
            FieldValue: null,
            mode: "error",
            error: error?.message || "Firestore initialization failed."
        };
    }

    return cachedFirestoreState;
}

async function createLocalAdapter(rootDir) {
    const dir = path.join(rootDir, LOCAL_ANALYTICS_DIR);
    const file = path.join(dir, LOCAL_ANALYTICS_FILE);

    async function readData() {
        try {
            const raw = await fs.readFile(file, "utf8");
            return ensureLocalShape(JSON.parse(raw));
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Analytics local store could not be read:", error?.message || error);
            }
            return ensureLocalShape({});
        }
    }

    async function writeData(data) {
        await fs.mkdir(dir, { recursive: true });
        const safe = ensureLocalShape(data);
        safe.events = safe.events.slice(0, MAX_RECENT_EVENTS).map(storageAnalyticsEvent);
        await fs.writeFile(file, `${JSON.stringify(safe, null, 2)}\n`, "utf8");
    }

    return {
        mode: "local",
        async record(event) {
            const data = await readData();
            const stored = storageAnalyticsEvent(event);
            data.events.unshift(stored);
            data.events = data.events.slice(0, MAX_RECENT_EVENTS);
            applyEventToLocalAggregates(data, stored);
            await writeData(data);
            return safeAnalyticsEvent(stored);
        },
        async overview() {
            const data = await readData();
            return buildOverviewFromLocal(data);
        },
        async games(filters = {}) {
            const data = await readData();
            const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
            return sortGames(Object.values(data.gameStats).map(safeGameStats), filters.sort).slice(0, limit);
        },
        async events(filters = {}) {
            const data = await readData();
            const events = filterEvents(data.events.map(safeAnalyticsEvent), filters)
                .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
            const { page, nextCursor } = paginate(events, filters);
            return { items: page, nextCursor };
        }
    };
}

function incrementPatch(fieldPath, value, FieldValue) {
    return { [fieldPath]: FieldValue.increment(value) };
}

async function createFirestoreAdapter(rootDir) {
    const state = await getFirestore(rootDir);
    if (!state.enabled || !state.db || !state.FieldValue) {
        if (!LOCAL_DEV_FALLBACK) {
            throw new AnalyticsError(503, "ANALYTICS_STORAGE_NOT_CONFIGURED", "Analytics storage is not configured.");
        }
        return createLocalAdapter(rootDir);
    }

    const { db, FieldValue } = state;
    const eventCollection = db.collection(COLLECTIONS.events);
    const dailyCollection = db.collection(COLLECTIONS.daily);
    const totalsDoc = db.collection(COLLECTIONS.totals).doc("global");
    const gameCollection = db.collection(COLLECTIONS.games);
    const sourceCollection = db.collection(COLLECTIONS.sources);

    return {
        mode: "firestore",
        async record(event) {
            const stored = storageAnalyticsEvent(event);
            const publicEvent = !stored.isAdminTraffic;
            await db.runTransaction(async (transaction) => {
                const eventRef = eventCollection.doc(stored.id);
                const dailyRef = dailyCollection.doc(stored.dayKey);
                const sourceRef = sourceCollection.doc(stored.source);

                transaction.set(eventRef, stored);
                transaction.set(dailyRef, {
                    dayKey: stored.dayKey,
                    updatedAt: stored.createdAt
                }, { merge: true });
                transaction.set(totalsDoc, {
                    updatedAt: stored.createdAt
                }, { merge: true });

                if (stored.isAdminTraffic && stored.eventType === "page_view") {
                    transaction.set(dailyRef, incrementPatch("adminPageViews", 1, FieldValue), { merge: true });
                }

                if (publicEvent) {
                    if (stored.eventType === "page_view") {
                        transaction.set(dailyRef, {
                            totalPageViews: FieldValue.increment(1),
                            [`bySource.${stored.source}`]: FieldValue.increment(1),
                            [`byDevice.${stored.deviceType}`]: FieldValue.increment(1)
                        }, { merge: true });
                        transaction.set(totalsDoc, {
                            totalViews: FieldValue.increment(1),
                            [`bySource.${stored.source}`]: FieldValue.increment(1),
                            [`byDevice.${stored.deviceType}`]: FieldValue.increment(1)
                        }, { merge: true });
                    }
                    if (stored.eventType === "game_view") {
                        transaction.set(dailyRef, { totalGameViews: FieldValue.increment(1) }, { merge: true });
                        transaction.set(totalsDoc, { totalGameViews: FieldValue.increment(1) }, { merge: true });
                    }
                    if (stored.eventType === "game_play_start") {
                        transaction.set(dailyRef, { totalGamePlays: FieldValue.increment(1) }, { merge: true });
                        transaction.set(totalsDoc, { totalGamePlays: FieldValue.increment(1) }, { merge: true });
                    }

                    transaction.set(sourceRef, {
                        source: stored.source,
                        updatedAt: stored.createdAt
                    }, { merge: true });
                    if (stored.eventType === "page_view") {
                        transaction.set(sourceRef, { totalViews: FieldValue.increment(1) }, { merge: true });
                    }
                    if (stored.eventType === "game_view") {
                        transaction.set(sourceRef, { totalGameViews: FieldValue.increment(1) }, { merge: true });
                    }
                    if (stored.eventType === "game_play_start") {
                        transaction.set(sourceRef, { totalGamePlays: FieldValue.increment(1) }, { merge: true });
                    }
                }

                if (publicEvent && stored.gameSlug && (stored.eventType === "game_view" || stored.eventType === "game_play_start")) {
                    const gameRef = gameCollection.doc(stored.gameSlug);
                    const gameSnapshot = await transaction.get(gameRef);
                    const existing = gameSnapshot.exists ? safeGameStats(gameSnapshot.data()) : safeGameStats({
                        gameSlug: stored.gameSlug,
                        gameTitle: stored.gameTitle
                    });
                    const resetToday = existing.todayDayKey !== stored.dayKey;
                    const basePatch = {
                        gameSlug: stored.gameSlug,
                        gameTitle: stored.gameTitle || existing.gameTitle || stored.gameSlug,
                        todayDayKey: stored.dayKey,
                        updatedAt: stored.createdAt,
                        [`bySource.${stored.source}`]: FieldValue.increment(1)
                    };
                    if (resetToday) {
                        basePatch.todayViews = 0;
                        basePatch.todayPlays = 0;
                    }
                    if (stored.eventType === "game_view") {
                        basePatch.totalViews = FieldValue.increment(1);
                        basePatch.todayViews = resetToday ? 1 : FieldValue.increment(1);
                        basePatch.lastViewedAt = stored.createdAt;
                    }
                    if (stored.eventType === "game_play_start") {
                        basePatch.totalPlays = FieldValue.increment(1);
                        basePatch.todayPlays = resetToday ? 1 : FieldValue.increment(1);
                        basePatch.lastPlayedAt = stored.createdAt;
                    }
                    transaction.set(gameRef, basePatch, { merge: true });
                }
            });
            return safeAnalyticsEvent(stored);
        },
        async overview() {
            const todayKey = dayKeyFromDate();
            const [
                totalsSnapshot,
                todaySnapshot,
                dailySnapshot,
                sourceSnapshot,
                topViewsSnapshot,
                topPlaysSnapshot
            ] = await Promise.all([
                totalsDoc.get(),
                dailyCollection.doc(todayKey).get(),
                dailyCollection.orderBy("dayKey", "desc").limit(14).get(),
                sourceCollection.orderBy("totalViews", "desc").limit(20).get(),
                gameCollection.orderBy("totalViews", "desc").limit(1).get(),
                gameCollection.orderBy("totalPlays", "desc").limit(1).get()
            ]);

            const totalsData = {
                ...defaultTotals(),
                ...(totalsSnapshot.exists ? totalsSnapshot.data() : {})
            };
            const today = safeDailyStats(todaySnapshot.exists ? todaySnapshot.data() : defaultDaily(todayKey), todayKey);
            const sourceItems = sourceSnapshot.docs.map((doc) => safeSourceStats({ source: doc.id, ...doc.data() }))
                .sort((left, right) => sourceActivity(right) - sourceActivity(left));
            const topGameByViews = topViewsSnapshot.docs[0]
                ? safeGameStats({ gameSlug: topViewsSnapshot.docs[0].id, ...topViewsSnapshot.docs[0].data() })
                : null;
            const topGameByPlays = topPlaysSnapshot.docs[0]
                ? safeGameStats({ gameSlug: topPlaysSnapshot.docs[0].id, ...topPlaysSnapshot.docs[0].data() })
                : null;

            return {
                totals: {
                    totalViews: safeNumber(totalsData.totalViews),
                    todayViews: today.totalPageViews,
                    totalGameViews: safeNumber(totalsData.totalGameViews),
                    todayGameViews: today.totalGameViews,
                    totalGamePlays: safeNumber(totalsData.totalGamePlays),
                    todayGamePlays: today.totalGamePlays,
                    uniqueSessionsApprox: null,
                    topSource: sourceItems[0]?.source || "",
                    topGameByViews,
                    topGameByPlays
                },
                daily: dailySnapshot.docs
                    .map((doc) => safeDailyStats({ dayKey: doc.id, ...doc.data() }))
                    .sort((left, right) => String(left.dayKey).localeCompare(String(right.dayKey))),
                bySource: sourceItems,
                byDevice: Object.entries(sanitizeCountMap(totalsData.byDevice)).map(([deviceType, count]) => ({
                    deviceType,
                    count
                })).sort((left, right) => right.count - left.count)
            };
        },
        async games(filters = {}) {
            const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
            const sort = normalizeText(filters.sort, 40);
            const field = {
                views: "totalViews",
                plays: "totalPlays",
                todayViews: "todayViews",
                todayPlays: "todayPlays",
                recent: "updatedAt"
            }[sort] || "totalPlays";
            const snapshot = await gameCollection.orderBy(field, "desc").limit(limit).get();
            return snapshot.docs.map((doc) => safeGameStats({ gameSlug: doc.id, ...doc.data() }));
        },
        async events(filters = {}) {
            const snapshot = await eventCollection.orderBy("createdAt", "desc").limit(ADMIN_EVENT_READ_LIMIT).get();
            const filtered = filterEvents(snapshot.docs.map((doc) => safeAnalyticsEvent({ id: doc.id, ...doc.data() })), filters);
            const { page, nextCursor } = paginate(filtered, filters);
            return { items: page, nextCursor };
        }
    };
}

function createAnalyticsStore(rootDir) {
    let adapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirestoreAdapter(rootDir);
        }
        return adapterPromise;
    }

    return {
        async recordEvent(input, context = {}) {
            const anonymousSessionId = normalizeText(input?.anonymousSessionId, 140);
            const userAgent = normalizeText(context.userAgent, 260);
            if (isLikelyBot(userAgent)) {
                return { ignored: true };
            }

            const eventType = normalizeEventType(input?.eventType);
            const requestKeyHash = context.requestKeyHash || buildAnalyticsRequesterHash(context.req, anonymousSessionId);
            enforceRateLimit(requestKeyHash, eventType);
            const event = normalizeEventInput({
                ...input,
                eventType
            }, {
                ...context,
                requestKeyHash,
                now: new Date().toISOString()
            });
            const adapter = await getAdapter();
            return adapter.record(event);
        },
        async getOverview() {
            const adapter = await getAdapter();
            return {
                ...(await adapter.overview()),
                storageMode: adapter.mode
            };
        },
        async listGames(filters = {}) {
            const adapter = await getAdapter();
            return {
                items: await adapter.games(filters),
                storageMode: adapter.mode
            };
        },
        async listEvents(filters = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.events(filters)),
                storageMode: adapter.mode
            };
        }
    };
}

module.exports = {
    ALLOWED_EVENT_TYPES,
    AnalyticsError,
    buildAnalyticsRequesterHash,
    createAnalyticsStore,
    mapSource,
    normalizeDeviceType,
    normalizeEventType,
    safeAnalyticsEvent
};
