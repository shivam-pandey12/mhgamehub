const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const AUDIT_COLLECTION = "adminAuditLogs";
const LOCAL_AUDIT_DIR = ".gamehub-data";
const LOCAL_AUDIT_FILE = "admin-audit-logs.json";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MAX_QUERY_LIMIT = 100;
const DEFAULT_QUERY_LIMIT = 50;
const MAX_LOCAL_READ = 1000;

let cachedAuditState = null;

class AdminAuditError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "AdminAuditError";
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

function normalizeLimit(value) {
    const limit = Number(value);
    if (!Number.isFinite(limit)) {
        return DEFAULT_QUERY_LIMIT;
    }
    return Math.min(Math.max(Math.floor(limit), 1), MAX_QUERY_LIMIT);
}

function makeAuditId() {
    return `audit_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
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

function buildAdminRequestMeta(req) {
    return {
        path: normalizeText(req?.originalUrl || req?.url || "", 260),
        method: normalizeText(req?.method || "", 12).toUpperCase(),
        userAgent: normalizeText(req?.headers?.["user-agent"] || "", 220),
        ipHash: hashValue(getRequestIp(req)).slice(0, 32)
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

async function getAuditState(rootDir) {
    if (cachedAuditState) {
        return cachedAuditState;
    }

    try {
        const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
        const { getFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";

        if (!serviceAccount && !allowApplicationDefault) {
            cachedAuditState = { enabled: false, db: null, mode: "disabled" };
            return cachedAuditState;
        }

        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-admin-audit";
        const existingApp = getApps().find((app) => app.name === appName);
        const app = existingApp || initializeApp(
            serviceAccount
                ? { credential: cert(serviceAccount), projectId }
                : { credential: applicationDefault(), projectId },
            appName
        );

        cachedAuditState = {
            enabled: true,
            db: getFirestore(app),
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedAuditState = {
            enabled: false,
            db: null,
            mode: "error",
            error: error?.message || "Firebase Admin initialization failed."
        };
    }

    return cachedAuditState;
}

function isSensitiveKey(key) {
    return /(token|secret|password|private|signature|webhook|credential|auth|cookie|session|key)/i.test(String(key || ""));
}

function sanitizeSnapshot(value, depth = 0) {
    if (value == null || depth > 4) {
        return value == null ? null : "[Truncated]";
    }
    if (Array.isArray(value)) {
        return value.slice(0, 30).map((entry) => sanitizeSnapshot(entry, depth + 1));
    }
    if (typeof value === "object") {
        const safe = {};
        for (const [key, entry] of Object.entries(value).slice(0, 80)) {
            if (isSensitiveKey(key)) {
                continue;
            }
            safe[normalizeText(key, 80)] = sanitizeSnapshot(entry, depth + 1);
        }
        return safe;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    return normalizeMessage(value, 1000);
}

function safeAuditItem(item = {}) {
    return {
        id: normalizeText(item.id, 100),
        adminEmail: normalizeEmail(item.adminEmail) || "unknown",
        action: normalizeText(item.action, 100),
        targetType: normalizeText(item.targetType, 80),
        targetId: normalizeText(item.targetId, 180),
        targetEmail: normalizeEmail(item.targetEmail) || null,
        before: sanitizeSnapshot(item.before),
        after: sanitizeSnapshot(item.after),
        reason: normalizeMessage(item.reason, 500),
        createdAt: normalizeText(item.createdAt, 40),
        requestMeta: sanitizeSnapshot(item.requestMeta || {})
    };
}

function storageAuditItem(item = {}) {
    return safeAuditItem(item);
}

function normalizeCreateInput(input = {}, context = {}) {
    const adminEmail = normalizeEmail(input.adminEmail || context.adminEmail);
    const action = normalizeText(input.action, 100);
    const targetType = normalizeText(input.targetType, 80);
    if (!adminEmail) {
        throw new AdminAuditError(400, "INVALID_AUDIT_ADMIN", "Audit log requires an admin email.");
    }
    if (!action || !targetType) {
        throw new AdminAuditError(400, "INVALID_AUDIT_ACTION", "Audit log requires an action and target type.");
    }

    return storageAuditItem({
        id: makeAuditId(),
        adminEmail,
        action,
        targetType,
        targetId: normalizeText(input.targetId, 180),
        targetEmail: normalizeEmail(input.targetEmail) || null,
        before: sanitizeSnapshot(input.before),
        after: sanitizeSnapshot(input.after),
        reason: normalizeMessage(input.reason, 500),
        createdAt: new Date().toISOString(),
        requestMeta: sanitizeSnapshot(context.requestMeta || input.requestMeta || {})
    });
}

function filterAuditItems(items, filters = {}) {
    const action = normalizeText(filters.action, 100).toLowerCase();
    const targetType = normalizeText(filters.targetType, 80).toLowerCase();
    const targetEmail = normalizeText(filters.targetEmail, 180).toLowerCase();
    const adminEmail = normalizeText(filters.adminEmail, 180).toLowerCase();
    return items.filter((item) => {
        if (action && normalizeText(item.action, 100).toLowerCase() !== action) {
            return false;
        }
        if (targetType && normalizeText(item.targetType, 80).toLowerCase() !== targetType) {
            return false;
        }
        if (adminEmail && !normalizeText(item.adminEmail, 180).toLowerCase().includes(adminEmail)) {
            return false;
        }
        if (targetEmail) {
            const haystack = [
                item.targetEmail,
                item.targetId,
                item.reason,
                item.action
            ].join(" ").toLowerCase();
            if (!haystack.includes(targetEmail)) {
                return false;
            }
        }
        return true;
    });
}

function paginateItems(items, filters = {}) {
    const limit = normalizeLimit(filters.limit);
    const cursor = normalizeText(filters.cursor, 120);
    let startIndex = 0;
    if (cursor) {
        const index = items.findIndex((item) => item.id === cursor);
        startIndex = index >= 0 ? index + 1 : 0;
    }
    const page = items.slice(startIndex, startIndex + limit);
    return {
        items: page,
        nextCursor: startIndex + limit < items.length ? page[page.length - 1]?.id || null : null
    };
}

async function createLocalAdapter(rootDir) {
    const dir = path.join(rootDir, LOCAL_AUDIT_DIR);
    const file = path.join(dir, LOCAL_AUDIT_FILE);

    async function readItems() {
        try {
            const raw = await fs.readFile(file, "utf8");
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(storageAuditItem) : [];
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Admin audit local store could not be read:", error?.message || error);
            }
            return [];
        }
    }

    async function writeItems(items) {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, `${JSON.stringify(items.map(storageAuditItem), null, 2)}\n`, "utf8");
    }

    return {
        mode: "local",
        async create(item) {
            const items = await readItems();
            items.unshift(storageAuditItem(item));
            await writeItems(items.slice(0, MAX_LOCAL_READ));
            return safeAuditItem(item);
        },
        async readAll() {
            const items = await readItems();
            return items.map(safeAuditItem);
        }
    };
}

async function createFirestoreAdapter(rootDir) {
    const state = await getAuditState(rootDir);
    if (!state.enabled || !state.db) {
        if (IS_PRODUCTION) {
            throw new AdminAuditError(503, "ADMIN_AUDIT_STORAGE_NOT_CONFIGURED", "Admin audit storage is not configured.");
        }
        return createLocalAdapter(rootDir);
    }

    const collection = state.db.collection(AUDIT_COLLECTION);
    return {
        mode: state.mode,
        async create(item) {
            const stored = storageAuditItem(item);
            await collection.doc(stored.id).set(stored);
            return safeAuditItem(stored);
        },
        async readAll() {
            const snapshot = await collection.orderBy("createdAt", "desc").limit(MAX_LOCAL_READ).get();
            return snapshot.docs.map((doc) => safeAuditItem({ id: doc.id, ...doc.data() }));
        }
    };
}

function createAdminAuditStore(rootDir) {
    let adapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirestoreAdapter(rootDir);
        }
        return adapterPromise;
    }

    return {
        async ensureAvailable() {
            await getAdapter();
        },
        async create(input = {}, context = {}) {
            const adapter = await getAdapter();
            const item = normalizeCreateInput(input, context);
            return adapter.create(item);
        },
        async list(filters = {}) {
            const adapter = await getAdapter();
            const items = (await adapter.readAll())
                .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
            const filtered = filterAuditItems(items, filters);
            return {
                ...paginateItems(filtered, filters),
                storageMode: adapter.mode
            };
        }
    };
}

module.exports = {
    AdminAuditError,
    buildAdminRequestMeta,
    createAdminAuditStore,
    sanitizeSnapshot
};
