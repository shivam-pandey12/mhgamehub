const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const FEEDBACK_COLLECTION = "feedbackReports";
const LOCAL_FEEDBACK_DIR = ".gamehub-data";
const LOCAL_FEEDBACK_FILE = "feedback-reports.json";
const LOCAL_DEV_FALLBACK = process.env.NODE_ENV !== "production";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_LOCAL_READ = 1000;

const ALLOWED_TYPES = new Set(["feedback", "bug", "suggestion", "report"]);
const ALLOWED_STATUSES = new Set(["open", "reviewed", "fixed", "ignored"]);

const buckets = new Map();
let cachedFirestoreState = null;

class FeedbackError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "FeedbackError";
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

function normalizeMessage(value) {
    return String(value ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
        .trim();
}

function normalizeEmail(value) {
    const email = normalizeText(value, 180).toLowerCase();
    if (!email) {
        return "";
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizeType(value) {
    const type = normalizeText(value, 30).toLowerCase();
    if (!ALLOWED_TYPES.has(type)) {
        throw new FeedbackError(400, "INVALID_FEEDBACK_TYPE", "Invalid feedback type.");
    }
    return type;
}

function normalizeStatus(value) {
    const status = normalizeText(value, 30).toLowerCase();
    if (!ALLOWED_STATUSES.has(status)) {
        throw new FeedbackError(400, "INVALID_FEEDBACK_STATUS", "Invalid feedback status.");
    }
    return status;
}

function normalizeRating(value) {
    if (value == null || value === "") {
        return null;
    }
    const rating = Number(value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new FeedbackError(400, "INVALID_FEEDBACK_RATING", "Invalid feedback rating.");
    }
    return rating;
}

function normalizeMessagePayload(value) {
    const message = normalizeMessage(value);
    if (message.length < 5) {
        throw new FeedbackError(400, "FEEDBACK_MESSAGE_TOO_SHORT", "Feedback message must be at least 5 characters.");
    }
    if (message.length > 2000) {
        throw new FeedbackError(400, "FEEDBACK_MESSAGE_TOO_LONG", "Feedback message must be 2000 characters or fewer.");
    }
    return message;
}

function makeId() {
    return `fb_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
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

function buildRequesterHash(req, anonymousSessionId = "") {
    const raw = `${getRequestIp(req)}|${normalizeText(anonymousSessionId, 120) || "anonymous"}`;
    return hashValue(raw).slice(0, 32);
}

function enforceRateLimit(rateKey) {
    const key = String(rateKey || "anonymous");
    const now = Date.now();
    const current = buckets.get(key) || [];
    const recent = current.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
        buckets.set(key, recent);
        throw new FeedbackError(429, "FEEDBACK_RATE_LIMITED", "Too many feedback submissions. Please try again later.");
    }
    recent.push(now);
    buckets.set(key, recent);

    if (buckets.size > 5000) {
        for (const [bucketKey, timestamps] of buckets.entries()) {
            if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
                buckets.delete(bucketKey);
            }
        }
    }
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
        const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";

        if (!serviceAccount && !allowApplicationDefault) {
            cachedFirestoreState = { enabled: false, db: null, mode: "disabled" };
            return cachedFirestoreState;
        }

        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-feedback-admin";
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
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedFirestoreState = {
            enabled: false,
            db: null,
            mode: "error",
            error: error?.message || "Firestore initialization failed."
        };
    }

    return cachedFirestoreState;
}

function safeFeedbackItem(item) {
    return {
        id: normalizeText(item.id, 80),
        type: normalizeText(item.type, 30),
        rating: item.rating == null ? null : Number(item.rating),
        message: normalizeMessage(item.message).slice(0, 2000),
        gameSlug: normalizeText(item.gameSlug, 140),
        gameTitle: normalizeText(item.gameTitle, 180),
        path: normalizeText(item.path, 280),
        verifiedUserEmail: normalizeEmail(item.verifiedUserEmail),
        verifiedUserId: normalizeText(item.verifiedUserId, 140) || null,
        contactEmail: normalizeEmail(item.contactEmail) || null,
        anonymousSessionId: normalizeText(item.anonymousSessionId, 140),
        userAgent: normalizeText(item.userAgent, 240),
        status: ALLOWED_STATUSES.has(item.status) ? item.status : "open",
        createdAt: normalizeText(item.createdAt, 40),
        updatedAt: normalizeText(item.updatedAt, 40),
        adminNote: normalizeMessage(item.adminNote || "").slice(0, 1000) || null,
        reviewedBy: normalizeEmail(item.reviewedBy) || null,
        reviewedAt: normalizeText(item.reviewedAt, 40) || null
    };
}

function storageFeedbackItem(item) {
    return {
        ...safeFeedbackItem(item),
        requestKeyHash: normalizeText(item.requestKeyHash, 80)
    };
}

function buildSummary(items) {
    return items.reduce((summary, item) => {
        summary.total += 1;
        if (item.status === "fixed") {
            summary.fixed += 1;
        }
        if (item.status === "open" && item.type === "bug") {
            summary.openBugs += 1;
        }
        if (item.status === "open" && item.type === "suggestion") {
            summary.openSuggestions += 1;
        }
        if (item.status === "open") {
            summary.open += 1;
        }
        return summary;
    }, {
        total: 0,
        open: 0,
        openBugs: 0,
        openSuggestions: 0,
        fixed: 0
    });
}

function filterItems(items, filters = {}) {
    const status = normalizeText(filters.status, 30).toLowerCase();
    const type = normalizeText(filters.type, 30).toLowerCase();
    const gameSlug = normalizeText(filters.gameSlug, 140).toLowerCase();
    const search = normalizeText(filters.search, 160).toLowerCase();

    return items.filter((item) => {
        if (status && ALLOWED_STATUSES.has(status) && item.status !== status) {
            return false;
        }
        if (type && ALLOWED_TYPES.has(type) && item.type !== type) {
            return false;
        }
        if (gameSlug && String(item.gameSlug || "").toLowerCase() !== gameSlug) {
            return false;
        }
        if (search) {
            const haystack = [
                item.message,
                item.gameTitle,
                item.gameSlug,
                item.path,
                item.verifiedUserEmail,
                item.contactEmail,
                item.anonymousSessionId
            ].join(" ").toLowerCase();
            if (!haystack.includes(search)) {
                return false;
            }
        }
        return true;
    });
}

function paginateItems(items, filters = {}) {
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

function normalizeCreateInput(input = {}, context = {}) {
    const type = normalizeType(input.type || "feedback");
    const message = normalizeMessagePayload(input.message);
    const rating = normalizeRating(input.rating);
    const verifiedSession = context.verifiedSession || null;

    return {
        id: makeId(),
        type,
        rating,
        message,
        gameSlug: normalizeText(input.gameSlug, 140),
        gameTitle: normalizeText(input.gameTitle, 180),
        path: normalizeText(input.path, 280),
        verifiedUserEmail: normalizeEmail(verifiedSession?.email) || null,
        verifiedUserId: normalizeText(verifiedSession?.uid, 140) || null,
        contactEmail: normalizeEmail(input.contactEmail) || null,
        anonymousSessionId: normalizeText(input.anonymousSessionId, 140),
        userAgent: normalizeText(context.userAgent, 240),
        requestKeyHash: normalizeText(context.requestKeyHash, 80),
        status: "open",
        createdAt: context.now,
        updatedAt: context.now,
        adminNote: null,
        reviewedBy: null,
        reviewedAt: null
    };
}

async function createLocalAdapter(rootDir) {
    const dir = path.join(rootDir, LOCAL_FEEDBACK_DIR);
    const file = path.join(dir, LOCAL_FEEDBACK_FILE);

    async function readItems() {
        try {
            const raw = await fs.readFile(file, "utf8");
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(storageFeedbackItem) : [];
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Feedback local store could not be read:", error?.message || error);
            }
            return [];
        }
    }

    async function writeItems(items) {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, `${JSON.stringify(items.map(storageFeedbackItem), null, 2)}\n`, "utf8");
    }

    return {
        mode: "local",
        async create(item) {
            const items = await readItems();
            items.unshift(storageFeedbackItem(item));
            await writeItems(items.slice(0, MAX_LOCAL_READ));
            return safeFeedbackItem(item);
        },
        async readAll() {
            const items = await readItems();
            return items.map(safeFeedbackItem);
        },
        async get(id) {
            const items = await readItems();
            const item = items.find((entry) => entry.id === id);
            return item ? safeFeedbackItem(item) : null;
        },
        async update(id, patch) {
            const items = await readItems();
            const index = items.findIndex((entry) => entry.id === id);
            if (index < 0) {
                return null;
            }
            const updated = storageFeedbackItem({ ...items[index], ...patch });
            items[index] = updated;
            await writeItems(items);
            return safeFeedbackItem(updated);
        }
    };
}

async function createFirestoreAdapter(rootDir) {
    const state = await getFirestore(rootDir);
    if (!state.enabled || !state.db) {
        if (!LOCAL_DEV_FALLBACK) {
            throw new FeedbackError(503, "FEEDBACK_STORAGE_NOT_CONFIGURED", "Feedback storage is not configured.");
        }
        return createLocalAdapter(rootDir);
    }

    const collection = state.db.collection(FEEDBACK_COLLECTION);
    return {
        mode: "firestore",
        async create(item) {
            const stored = storageFeedbackItem(item);
            await collection.doc(stored.id).set(stored);
            return safeFeedbackItem(stored);
        },
        async readAll() {
            const snapshot = await collection.orderBy("createdAt", "desc").limit(MAX_LOCAL_READ).get();
            return snapshot.docs.map((doc) => safeFeedbackItem({ id: doc.id, ...doc.data() }));
        },
        async get(id) {
            const snapshot = await collection.doc(id).get();
            return snapshot.exists ? safeFeedbackItem({ id: snapshot.id, ...snapshot.data() }) : null;
        },
        async update(id, patch) {
            const ref = collection.doc(id);
            const snapshot = await ref.get();
            if (!snapshot.exists) {
                return null;
            }
            await ref.update(patch);
            const updated = await ref.get();
            return safeFeedbackItem({ id: updated.id, ...updated.data() });
        }
    };
}

function createFeedbackStore(rootDir) {
    let adapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirestoreAdapter(rootDir);
        }
        return adapterPromise;
    }

    return {
        async create(input, context = {}) {
            const anonymousSessionId = normalizeText(input?.anonymousSessionId, 140);
            const requestKeyHash = context.requestKeyHash || buildRequesterHash(context.req, anonymousSessionId);
            enforceRateLimit(requestKeyHash);

            const now = new Date().toISOString();
            const item = normalizeCreateInput(input, {
                ...context,
                requestKeyHash,
                now
            });
            const adapter = await getAdapter();
            return adapter.create(item);
        },
        async list(filters = {}) {
            const adapter = await getAdapter();
            const allItems = (await adapter.readAll())
                .map(safeFeedbackItem)
                .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
            const filtered = filterItems(allItems, filters);
            const { page, nextCursor } = paginateItems(filtered, filters);
            return {
                items: page,
                nextCursor,
                summary: buildSummary(allItems),
                storageMode: adapter.mode
            };
        },
        async get(id) {
            const safeId = normalizeText(id, 100);
            if (!safeId || !/^[a-zA-Z0-9_-]+$/.test(safeId)) {
                throw new FeedbackError(400, "INVALID_FEEDBACK_ID", "Invalid feedback id.");
            }
            const adapter = await getAdapter();
            const item = await adapter.get(safeId);
            if (!item) {
                throw new FeedbackError(404, "FEEDBACK_NOT_FOUND", "Feedback item was not found.");
            }
            return item;
        },
        async update(id, input = {}, adminEmail = "") {
            const safeId = normalizeText(id, 100);
            if (!safeId || !/^[a-zA-Z0-9_-]+$/.test(safeId)) {
                throw new FeedbackError(400, "INVALID_FEEDBACK_ID", "Invalid feedback id.");
            }

            const patch = {
                updatedAt: new Date().toISOString(),
                reviewedBy: normalizeEmail(adminEmail) || null
            };

            if (Object.prototype.hasOwnProperty.call(input, "status")) {
                patch.status = normalizeStatus(input.status);
                patch.reviewedAt = patch.status === "open" ? null : patch.updatedAt;
            }

            if (Object.prototype.hasOwnProperty.call(input, "adminNote")) {
                patch.adminNote = normalizeMessage(input.adminNote).slice(0, 1000) || null;
            }

            const adapter = await getAdapter();
            const updated = await adapter.update(safeId, patch);
            if (!updated) {
                throw new FeedbackError(404, "FEEDBACK_NOT_FOUND", "Feedback item was not found.");
            }
            return updated;
        }
    };
}

module.exports = {
    ALLOWED_STATUSES,
    ALLOWED_TYPES,
    FeedbackError,
    buildRequesterHash,
    createFeedbackStore,
    normalizeEmail,
    normalizeStatus,
    normalizeType,
    safeFeedbackItem
};
