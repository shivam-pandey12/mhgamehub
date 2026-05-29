const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const MODERATION_COLLECTION = "moderationRecords";
const LOCAL_MODERATION_DIR = ".gamehub-data";
const LOCAL_MODERATION_FILE = "moderation-records.json";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MAX_QUERY_LIMIT = 100;
const DEFAULT_QUERY_LIMIT = 50;
const MAX_LOCAL_READ = 1000;

const ALLOWED_TARGET_TYPES = new Set(["user", "session", "room", "feedback", "queue", "socket"]);
const ALLOWED_ACTIONS = new Set([
    "room.close",
    "player.kick",
    "queue.remove",
    "feedback.mark_moderation",
    "feedback.mark_spam",
    "feedback.mark_resolved",
    "feedback.mark_ignored",
    "user.note",
    "session.note",
    "session.feedback_mute",
    "session.feedback_unmute",
    "user.warning_note"
]);
const ALLOWED_STATUSES = new Set([
    "open",
    "active",
    "ended",
    "resolved",
    "ignored",
    "moderation_review",
    "spam"
]);

let cachedModerationState = null;

class ModerationError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "ModerationError";
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

function normalizeTargetType(value) {
    const targetType = normalizeText(value, 40).toLowerCase();
    if (!ALLOWED_TARGET_TYPES.has(targetType)) {
        throw new ModerationError(400, "INVALID_MODERATION_TARGET_TYPE", "Invalid moderation target type.");
    }
    return targetType;
}

function normalizeAction(value) {
    const action = normalizeText(value, 80).toLowerCase();
    if (!ALLOWED_ACTIONS.has(action)) {
        throw new ModerationError(400, "INVALID_MODERATION_ACTION", "Invalid moderation action.");
    }
    return action;
}

function normalizeStatus(value, fallback = "open") {
    const status = normalizeText(value, 40).toLowerCase();
    return ALLOWED_STATUSES.has(status) ? status : fallback;
}

function requireReason(value) {
    const reason = normalizeMessage(value, 500);
    if (reason.length < 5) {
        throw new ModerationError(400, "MODERATION_REASON_REQUIRED", "A reason of at least 5 characters is required.");
    }
    return reason;
}

function requireConfirmation(value) {
    if (value !== true) {
        throw new ModerationError(400, "MODERATION_CONFIRMATION_REQUIRED", "Confirmation is required for this moderation action.");
    }
}

function normalizeDurationMinutes(value) {
    const duration = Number(value);
    if (!Number.isFinite(duration) || duration < 10 || duration > 1440) {
        throw new ModerationError(400, "INVALID_MODERATION_DURATION", "Duration must be between 10 and 1440 minutes.");
    }
    return Math.floor(duration);
}

function toIsoDate(value) {
    if (!value) {
        return null;
    }
    if (typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    if (typeof value === "number") {
        const millis = value > 10_000_000_000 ? value : value * 1000;
        const date = new Date(millis);
        return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    if (typeof value?.toDate === "function") {
        const date = value.toDate();
        return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    if (typeof value?.toMillis === "function") {
        const date = new Date(value.toMillis());
        return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    return null;
}

function makeModerationId() {
    return `mod_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
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

async function getModerationState(rootDir) {
    if (cachedModerationState) {
        return cachedModerationState;
    }

    try {
        const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
        const { getFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";

        if (!serviceAccount && !allowApplicationDefault) {
            cachedModerationState = { enabled: false, db: null, mode: "disabled" };
            return cachedModerationState;
        }

        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-moderation";
        const existingApp = getApps().find((app) => app.name === appName);
        const app = existingApp || initializeApp(
            serviceAccount
                ? { credential: cert(serviceAccount), projectId }
                : { credential: applicationDefault(), projectId },
            appName
        );

        cachedModerationState = {
            enabled: true,
            db: getFirestore(app),
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedModerationState = {
            enabled: false,
            db: null,
            mode: "error",
            error: error?.message || "Firebase Admin initialization failed."
        };
    }

    return cachedModerationState;
}

function safeModerationItem(item = {}) {
    return {
        id: normalizeText(item.id, 100),
        targetType: normalizeText(item.targetType, 40),
        targetId: normalizeText(item.targetId, 180),
        targetEmail: normalizeEmail(item.targetEmail) || null,
        targetGameSlug: normalizeText(item.targetGameSlug, 140),
        action: normalizeText(item.action, 80),
        status: normalizeStatus(item.status, "open"),
        reason: normalizeMessage(item.reason, 500),
        adminNote: normalizeMessage(item.adminNote, 1000) || null,
        createdBy: normalizeEmail(item.createdBy) || "unknown",
        createdAt: normalizeText(toIsoDate(item.createdAt) || item.createdAt, 40),
        updatedAt: normalizeText(toIsoDate(item.updatedAt) || item.updatedAt, 40),
        expiresAt: normalizeText(toIsoDate(item.expiresAt) || item.expiresAt, 40) || null,
        endedAt: normalizeText(toIsoDate(item.endedAt) || item.endedAt, 40) || null,
        linkedFeedbackId: normalizeText(item.linkedFeedbackId, 100) || null,
        linkedRoomId: normalizeText(item.linkedRoomId, 180) || null,
        linkedAuditLogId: normalizeText(item.linkedAuditLogId, 120) || null
    };
}

function storageModerationItem(item = {}) {
    return safeModerationItem(item);
}

function normalizeCreateInput(input = {}, context = {}) {
    const now = new Date().toISOString();
    const targetType = normalizeTargetType(input.targetType);
    const action = normalizeAction(input.action);
    const reason = requireReason(input.reason);
    const createdBy = normalizeEmail(input.createdBy || context.adminEmail);
    if (!createdBy) {
        throw new ModerationError(400, "INVALID_MODERATION_ADMIN", "A valid admin email is required.");
    }

    return storageModerationItem({
        id: makeModerationId(),
        targetType,
        targetId: normalizeText(input.targetId, 180),
        targetEmail: normalizeEmail(input.targetEmail) || null,
        targetGameSlug: normalizeText(input.targetGameSlug, 140),
        action,
        status: normalizeStatus(input.status, "open"),
        reason,
        adminNote: normalizeMessage(input.adminNote, 1000) || null,
        createdBy,
        createdAt: now,
        updatedAt: now,
        expiresAt: toIsoDate(input.expiresAt),
        endedAt: null,
        linkedFeedbackId: normalizeText(input.linkedFeedbackId, 100) || null,
        linkedRoomId: normalizeText(input.linkedRoomId, 180) || null,
        linkedAuditLogId: normalizeText(input.linkedAuditLogId, 120) || null
    });
}

function normalizeFeedbackMuteInput(input = {}, context = {}) {
    requireConfirmation(input.confirmed);
    const reason = requireReason(input.reason);
    const userEmail = normalizeEmail(input.userEmail);
    const sessionId = normalizeText(input.sessionId, 140);
    if (!userEmail && !sessionId) {
        throw new ModerationError(400, "MODERATION_TARGET_REQUIRED", "User email or session id is required.");
    }
    const durationMinutes = normalizeDurationMinutes(input.durationMinutes);
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
    return normalizeCreateInput({
        targetType: userEmail ? "user" : "session",
        targetId: sessionId || userEmail,
        targetEmail: userEmail || null,
        action: "session.feedback_mute",
        status: "active",
        reason,
        adminNote: input.adminNote,
        expiresAt
    }, context);
}

function filterItems(items, filters = {}) {
    const targetType = normalizeText(filters.targetType, 40).toLowerCase();
    const action = normalizeText(filters.action, 80).toLowerCase();
    const status = normalizeText(filters.status, 40).toLowerCase();
    const search = normalizeText(filters.search, 160).toLowerCase();
    return items.filter((item) => {
        if (targetType && item.targetType !== targetType) {
            return false;
        }
        if (action && item.action !== action) {
            return false;
        }
        if (status && item.status !== status) {
            return false;
        }
        if (search) {
            const haystack = [
                item.targetId,
                item.targetEmail,
                item.targetGameSlug,
                item.action,
                item.status,
                item.reason,
                item.adminNote,
                item.linkedFeedbackId,
                item.linkedRoomId
            ].join(" ").toLowerCase();
            if (!haystack.includes(search)) {
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

function isActiveRestriction(item = {}, now = Date.now()) {
    if (item.action !== "session.feedback_mute" || item.status !== "active") {
        return false;
    }
    const expiresAt = item.expiresAt ? Date.parse(item.expiresAt) : NaN;
    return Number.isFinite(expiresAt) && expiresAt > now;
}

function buildOverview(items = []) {
    const now = Date.now();
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = (item) => String(item.createdAt || "").slice(0, 10) === todayKey;
    const recentActions = items.slice(0, 10);
    return {
        totals: {
            openReports: items.filter((item) => item.action === "feedback.mark_moderation" && item.status === "moderation_review").length,
            spamFeedback: items.filter((item) => item.action === "feedback.mark_spam" && item.status === "spam").length,
            activeRestrictions: items.filter((item) => isActiveRestriction(item, now)).length,
            roomsClosedToday: items.filter((item) => item.action === "room.close" && today(item)).length,
            playersKickedToday: items.filter((item) => item.action === "player.kick" && today(item)).length,
            queueEntriesClearedToday: items.filter((item) => item.action === "queue.remove" && today(item)).length
        },
        recentActions
    };
}

async function createLocalAdapter(rootDir) {
    const dir = path.join(rootDir, LOCAL_MODERATION_DIR);
    const file = path.join(dir, LOCAL_MODERATION_FILE);

    async function readItems() {
        try {
            const raw = await fs.readFile(file, "utf8");
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(storageModerationItem) : [];
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Moderation local store could not be read:", error?.message || error);
            }
            return [];
        }
    }

    async function writeItems(items) {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, `${JSON.stringify(items.map(storageModerationItem), null, 2)}\n`, "utf8");
    }

    return {
        mode: "local",
        async create(item) {
            const items = await readItems();
            items.unshift(storageModerationItem(item));
            await writeItems(items.slice(0, MAX_LOCAL_READ));
            return safeModerationItem(item);
        },
        async readAll() {
            return (await readItems()).map(safeModerationItem);
        },
        async get(id) {
            const item = (await readItems()).find((entry) => entry.id === id);
            return item ? safeModerationItem(item) : null;
        },
        async update(id, patch) {
            const items = await readItems();
            const index = items.findIndex((entry) => entry.id === id);
            if (index < 0) {
                return null;
            }
            const updated = storageModerationItem({ ...items[index], ...patch });
            items[index] = updated;
            await writeItems(items);
            return safeModerationItem(updated);
        }
    };
}

async function createFirestoreAdapter(rootDir) {
    const state = await getModerationState(rootDir);
    if (!state.enabled || !state.db) {
        if (IS_PRODUCTION) {
            throw new ModerationError(503, "MODERATION_STORAGE_NOT_CONFIGURED", "Moderation storage is not configured.");
        }
        return createLocalAdapter(rootDir);
    }

    const collection = state.db.collection(MODERATION_COLLECTION);
    return {
        mode: state.mode,
        async create(item) {
            const stored = storageModerationItem(item);
            await collection.doc(stored.id).set(stored);
            return safeModerationItem(stored);
        },
        async readAll() {
            const snapshot = await collection.orderBy("createdAt", "desc").limit(MAX_LOCAL_READ).get();
            return snapshot.docs.map((doc) => safeModerationItem({ id: doc.id, ...doc.data() }));
        },
        async get(id) {
            const snapshot = await collection.doc(id).get();
            return snapshot.exists ? safeModerationItem({ id: snapshot.id, ...snapshot.data() }) : null;
        },
        async update(id, patch) {
            const ref = collection.doc(id);
            const snapshot = await ref.get();
            if (!snapshot.exists) {
                return null;
            }
            await ref.update(patch);
            const updated = await ref.get();
            return safeModerationItem({ id: updated.id, ...updated.data() });
        }
    };
}

function createModerationStore(rootDir) {
    let adapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirestoreAdapter(rootDir);
        }
        return adapterPromise;
    }

    return {
        async ensureAvailable() {
            const adapter = await getAdapter();
            return {
                ok: true,
                storageMode: adapter.mode
            };
        },
        async create(input = {}, context = {}) {
            const adapter = await getAdapter();
            const item = normalizeCreateInput(input, context);
            return {
                item: await adapter.create(item),
                storageMode: adapter.mode
            };
        },
        async list(filters = {}) {
            const adapter = await getAdapter();
            const items = (await adapter.readAll())
                .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
            const filtered = filterItems(items, filters);
            return {
                ...paginateItems(filtered, filters),
                storageMode: adapter.mode
            };
        },
        async getOverview() {
            const adapter = await getAdapter();
            const items = (await adapter.readAll())
                .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
            return {
                ...buildOverview(items),
                storageMode: adapter.mode
            };
        },
        async createFeedbackMute(input = {}, context = {}) {
            const adapter = await getAdapter();
            const item = normalizeFeedbackMuteInput(input, context);
            return {
                item: await adapter.create(item),
                before: null,
                after: item,
                reason: item.reason,
                storageMode: adapter.mode
            };
        },
        async endFeedbackMute(input = {}, context = {}) {
            const adapter = await getAdapter();
            requireConfirmation(input.confirmed);
            const reason = requireReason(input.reason);
            const restrictionId = normalizeText(input.restrictionId, 100);
            if (!restrictionId || !/^[a-zA-Z0-9_-]+$/.test(restrictionId)) {
                throw new ModerationError(400, "INVALID_RESTRICTION_ID", "Invalid restriction id.");
            }
            const before = await adapter.get(restrictionId);
            if (!before || before.action !== "session.feedback_mute") {
                throw new ModerationError(404, "RESTRICTION_NOT_FOUND", "Feedback mute restriction was not found.");
            }
            const after = await adapter.update(restrictionId, {
                status: "ended",
                endedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                adminNote: normalizeMessage(input.adminNote, 1000) || before.adminNote || null
            });
            const unmute = await adapter.create(normalizeCreateInput({
                targetType: before.targetType,
                targetId: before.targetId,
                targetEmail: before.targetEmail,
                targetGameSlug: before.targetGameSlug,
                action: "session.feedback_unmute",
                status: "ended",
                reason,
                adminNote: input.adminNote
            }, context));
            return {
                item: after,
                record: unmute,
                before,
                after,
                reason,
                storageMode: adapter.mode
            };
        },
        async createUserNote(input = {}, context = {}) {
            const note = normalizeMessage(input.note, 1000);
            if (!note) {
                throw new ModerationError(400, "MODERATION_NOTE_REQUIRED", "A moderation note is required.");
            }
            const userEmail = normalizeEmail(input.userEmail);
            const userId = normalizeText(input.userId, 160);
            const sessionId = normalizeText(input.sessionId, 140);
            if (!userEmail && !userId && !sessionId) {
                throw new ModerationError(400, "MODERATION_TARGET_REQUIRED", "User email, user id, or session id is required.");
            }
            const targetType = userEmail || userId ? "user" : "session";
            return this.create({
                targetType,
                targetId: userId || sessionId || userEmail,
                targetEmail: userEmail || null,
                action: targetType === "user" ? "user.note" : "session.note",
                status: "open",
                reason: input.reason,
                adminNote: note
            }, context);
        },
        async findActiveFeedbackRestriction({ verifiedUserEmail = "", anonymousSessionId = "" } = {}) {
            const adapter = await getAdapter();
            const email = normalizeEmail(verifiedUserEmail);
            const sessionId = normalizeText(anonymousSessionId, 140);
            if (!email && !sessionId) {
                return null;
            }
            const now = Date.now();
            const items = await adapter.readAll();
            return items.find((item) => (
                isActiveRestriction(item, now)
                && (
                    (email && item.targetEmail === email)
                    || (sessionId && normalizeText(item.targetId, 140) === sessionId)
                )
            )) || null;
        }
    };
}

module.exports = {
    ALLOWED_ACTIONS,
    ALLOWED_STATUSES,
    ModerationError,
    createModerationStore,
    requireConfirmation,
    requireReason,
    safeModerationItem
};
