const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const USER_PROFILE_COLLECTIONS = ["users", "userProfiles", "premiumUsers", "members"];
const ENTITLEMENT_COLLECTIONS = ["entitlements", "premiumEntitlements", "userEntitlements", "accessPasses"];
const OWNED_ITEM_COLLECTIONS = ["ownedItems", "userOwnedItems"];
const PRIMARY_ENTITLEMENT_COLLECTION = "entitlements";
const LOCAL_ACCOUNTS_DIR = ".gamehub-data";
const LOCAL_ENTITLEMENTS_FILE = "admin-entitlements.json";
const ALLOWED_ENTITLEMENT_TYPES = ["premium", "premium_pass", "monthly_pass", "yearly_pass", "game_access", "catalog_access"];
const MAX_QUERY_LIMIT = 100;
const DEFAULT_QUERY_LIMIT = 50;
const SUPPORTING_READ_LIMIT = 300;
const OVERVIEW_READ_LIMIT = 1000;

let cachedAdminState = null;

class AdminAccountsError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = "AdminAccountsError";
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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizeStatus(value, allowed, fallback = "") {
    const status = normalizeText(value, 80).toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
    return allowed.includes(status) ? status : fallback;
}

function normalizeLimit(value) {
    const limit = Number(value);
    if (!Number.isFinite(limit)) {
        return DEFAULT_QUERY_LIMIT;
    }
    return Math.min(Math.max(Math.floor(limit), 1), MAX_QUERY_LIMIT);
}

function normalizeMessage(value, maxLength = 1000) {
    return String(value ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
        .trim()
        .slice(0, maxLength);
}

function requireReason(value) {
    const reason = normalizeMessage(value, 500);
    if (reason.length < 5) {
        throw new AdminAccountsError(400, "ADMIN_REASON_REQUIRED", "A reason of at least 5 characters is required.");
    }
    return reason;
}

function requireConfirmation(value) {
    if (value !== true) {
        throw new AdminAccountsError(400, "ADMIN_CONFIRMATION_REQUIRED", "Confirmation is required for this entitlement action.");
    }
}

function normalizeEntitlementType(value) {
    const type = normalizeStatus(value, ALLOWED_ENTITLEMENT_TYPES, "");
    if (!type) {
        throw new AdminAccountsError(400, "INVALID_ENTITLEMENT_TYPE", "Invalid entitlement type.");
    }
    return type;
}

function makeManualEntitlementId() {
    return `manual_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
}

function firstText(source, keys, maxLength = 240) {
    for (const key of keys) {
        const value = getNestedValue(source, key);
        if (value !== undefined && value !== null && value !== "") {
            return normalizeText(value, maxLength);
        }
    }
    return "";
}

function getNestedValue(source, keyPath) {
    const segments = String(keyPath || "").split(".");
    let value = source;
    for (const segment of segments) {
        if (!value || typeof value !== "object" || !(segment in value)) {
            return undefined;
        }
        value = value[segment];
    }
    return value;
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
    if (typeof value === "object" && Number.isFinite(Number(value.seconds))) {
        const date = new Date(Number(value.seconds) * 1000);
        return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    return null;
}

function firstDate(source, keys) {
    for (const key of keys) {
        const value = getNestedValue(source, key);
        const date = toIsoDate(value);
        if (date) {
            return date;
        }
    }
    return null;
}

function dateIsFuture(value) {
    const date = value ? new Date(value) : null;
    return Boolean(date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now());
}

function dateIsPast(value) {
    const date = value ? new Date(value) : null;
    return Boolean(date && !Number.isNaN(date.getTime()) && date.getTime() <= Date.now());
}

function normalizeFutureDate(value, code = "INVALID_ENTITLEMENT_EXPIRY") {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) {
        throw new AdminAccountsError(400, code, "A valid future expiry date is required.");
    }
    if (date.getTime() <= Date.now()) {
        throw new AdminAccountsError(400, code, "Expiry date must be in the future.");
    }
    return date.toISOString();
}

function normalizeDurationDays(value) {
    if (value == null || value === "") {
        return null;
    }
    const days = Number(value);
    if (!Number.isFinite(days) || days <= 0 || days > 3660) {
        throw new AdminAccountsError(400, "INVALID_ENTITLEMENT_DURATION", "Duration must be between 1 and 3660 days.");
    }
    return Math.floor(days);
}

function expiryFromDuration(durationDays, baseDate = new Date()) {
    const baseTime = baseDate instanceof Date && !Number.isNaN(baseDate.getTime()) ? baseDate.getTime() : Date.now();
    return new Date(baseTime + durationDays * 24 * 60 * 60 * 1000).toISOString();
}

function publicId(collectionName, id) {
    return `${normalizeText(collectionName, 80)}:${normalizeText(id, 160)}`;
}

function stripPublicId(id) {
    const text = normalizeText(id, 240);
    const index = text.indexOf(":");
    return index >= 0 ? text.slice(index + 1) : text;
}

function parseEntitlementPublicId(id) {
    const safeId = normalizeText(id, 240);
    const index = safeId.indexOf(":");
    if (index <= 0 || index >= safeId.length - 1) {
        throw new AdminAccountsError(400, "INVALID_ENTITLEMENT_ID", "Invalid entitlement id.");
    }
    const collectionName = normalizeText(safeId.slice(0, index), 80);
    const docId = normalizeText(safeId.slice(index + 1), 160);
    if (!ENTITLEMENT_COLLECTIONS.includes(collectionName) || !docId || /[\/\\]/.test(docId)) {
        throw new AdminAccountsError(400, "INVALID_ENTITLEMENT_ID", "Invalid entitlement id.");
    }
    return { collectionName, docId };
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

async function getAdminState(rootDir) {
    if (cachedAdminState) {
        return cachedAdminState;
    }

    try {
        const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
        const { getAuth } = require("firebase-admin/auth");
        const { getFirestore } = require("firebase-admin/firestore");
        const serviceAccount = await readServiceAccount(rootDir);
        const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true";

        if (!serviceAccount && !allowApplicationDefault) {
            cachedAdminState = { enabled: false, auth: null, db: null, mode: "disabled" };
            return cachedAdminState;
        }

        const projectId = process.env.FIREBASE_PROJECT_ID
            || process.env.GOOGLE_CLOUD_PROJECT
            || process.env.GCLOUD_PROJECT
            || serviceAccount?.project_id
            || undefined;
        const appName = "gamehub-admin-accounts";
        const existingApp = getApps().find((app) => app.name === appName);
        const app = existingApp || initializeApp(
            serviceAccount
                ? { credential: cert(serviceAccount), projectId }
                : { credential: applicationDefault(), projectId },
            appName
        );

        cachedAdminState = {
            enabled: true,
            auth: getAuth(app),
            db: getFirestore(app),
            mode: serviceAccount ? "service-account" : "application-default"
        };
    } catch (error) {
        cachedAdminState = {
            enabled: false,
            auth: null,
            db: null,
            mode: "error",
            error: error?.message || "Firebase Admin initialization failed."
        };
    }

    return cachedAdminState;
}

function hasActivePlanText(value) {
    const plan = normalizeText(value, 80).toLowerCase();
    return Boolean(plan && !["free", "none", "basic", "guest"].includes(plan));
}

function inferEntitlementStatus(raw = {}) {
    const explicit = normalizeText(raw.status || raw.entitlementStatus || raw.state, 80).toLowerCase();
    if (["revoked", "cancelled", "canceled", "disabled"].includes(explicit)) {
        return "revoked";
    }
    if (["active", "paid", "captured", "valid"].includes(explicit)) {
        const expiresAt = firstDate(raw, ["expiresAt", "expiryDate", "expiresOn", "validUntil", "endsAt"]);
        return expiresAt && dateIsPast(expiresAt) ? "expired" : "active";
    }
    if (["expired", "ended"].includes(explicit)) {
        return "expired";
    }

    const expiresAt = firstDate(raw, ["expiresAt", "expiryDate", "expiresOn", "validUntil", "endsAt"]);
    if (expiresAt) {
        return dateIsFuture(expiresAt) ? "active" : "expired";
    }
    return "unknown";
}

function mapAuthUserToAdminSafeUser(user, profile = {}, entitlementGroup = []) {
    const profilePlan = firstText(profile, ["plan", "subscriptionPlan", "accessLevel", "tier", "passType"], 80);
    const activeEntitlements = entitlementGroup.filter((entry) => entry.status === "active");
    const expiredEntitlements = entitlementGroup.filter((entry) => entry.status === "expired");
    const plan = profilePlan || activeEntitlements[0]?.entitlementType || "free";
    const premiumStatus = activeEntitlements.length
        ? "active"
        : (expiredEntitlements.length ? "expired" : (hasActivePlanText(profilePlan) ? "premium" : "free"));

    return {
        id: normalizeText(user?.uid || profile.id || profile.userId || profile.uid, 160),
        email: normalizeEmail(user?.email || profile.email) || "Unknown",
        displayName: normalizeText(user?.displayName || profile.displayName || profile.name, 160),
        photoURL: normalizeText(user?.photoURL || profile.photoURL || profile.avatarUrl, 320),
        createdAt: toIsoDate(user?.metadata?.creationTime) || firstDate(profile, ["createdAt", "created", "joinedAt"]),
        lastLoginAt: toIsoDate(user?.metadata?.lastSignInTime) || firstDate(profile, ["lastLoginAt", "lastSeenAt", "updatedAt"]),
        plan,
        premiumStatus,
        entitlementSummary: activeEntitlements.length
            ? `${activeEntitlements.length} active`
            : (expiredEntitlements.length ? `${expiredEntitlements.length} expired` : "No active entitlements"),
        activeEntitlementsCount: activeEntitlements.length,
        expiredEntitlementsCount: expiredEntitlements.length
    };
}

function mapUserRecordToAdminSafeUser(record, entitlementGroup = []) {
    const data = record?.data || record || {};
    const id = normalizeText(record?.id || data.id || data.uid || data.userId, 160);
    return mapAuthUserToAdminSafeUser({
        uid: id,
        email: data.email,
        displayName: data.displayName || data.name,
        photoURL: data.photoURL || data.avatarUrl,
        metadata: {
            creationTime: firstDate(data, ["createdAt", "created", "joinedAt"]),
            lastSignInTime: firstDate(data, ["lastLoginAt", "lastSeenAt", "updatedAt"])
        }
    }, { ...data, id }, entitlementGroup);
}

function mapEntitlementToAdminSafeEntitlement(record) {
    const data = record?.data || record || {};
    const collectionName = record?.collectionName || "";
    const id = publicId(collectionName || "entitlement", record?.id || data.id || data.entitlementId);
    const startsAt = firstDate(data, ["startsAt", "startedAt", "validFrom", "createdAt"]);
    const expiresAt = firstDate(data, ["expiresAt", "expiryDate", "expiresOn", "validUntil", "endsAt"]);
    const email = normalizeEmail(firstText(data, ["email", "userEmail", "customerEmail", "verifiedUserEmail"], 180));
    return {
        id,
        userId: normalizeText(firstText(data, ["userId", "uid", "firebaseUid", "customerId"], 160) || stripPublicId(id), 160),
        email: email || "Unknown",
        entitlementType: firstText(data, ["entitlementType", "type", "plan", "passType", "productType", "accessLevel"], 120) || "unknown",
        source: firstText(data, ["source", "provider", "grantSource"], 100) || collectionName || "unknown",
        status: inferEntitlementStatus(data),
        startsAt,
        expiresAt,
        createdAt: firstDate(data, ["createdAt", "created", "grantedAt", "updatedAt"]),
        updatedAt: firstDate(data, ["updatedAt", "modifiedAt", "revokedAt", "noteUpdatedAt"]),
        plan: firstText(data, ["plan", "subscriptionPlan", "tier"], 120),
        productId: firstText(data, ["productId", "planId", "priceId", "sku", "itemId"], 160),
        adminNote: normalizeMessage(firstText(data, ["adminNote", "note"], 1000), 1000) || null,
        grantedBy: normalizeEmail(firstText(data, ["grantedBy", "manualGrantedBy"], 180)) || null,
        revokedBy: normalizeEmail(firstText(data, ["revokedBy"], 180)) || null,
        revokedAt: firstDate(data, ["revokedAt"])
    };
}

function mapOwnedItemToAdminSafeOwnedItem(record) {
    const data = record?.data || record || {};
    const collectionName = record?.collectionName || "";
    return {
        id: publicId(collectionName || "ownedItem", record?.id || data.id || data.itemId || data.productId),
        userId: normalizeText(firstText(data, ["userId", "uid", "firebaseUid", "customerId"], 160), 160),
        email: normalizeEmail(firstText(data, ["email", "userEmail", "customerEmail", "verifiedUserEmail"], 180)) || "Unknown",
        itemId: firstText(data, ["itemId", "productId", "sku", "id"], 160) || stripPublicId(record?.id || ""),
        title: firstText(data, ["title", "name", "itemTitle", "productName"], 180) || "Owned item",
        category: firstText(data, ["category", "productType", "type"], 120) || "item",
        source: firstText(data, ["source", "provider", "grantSource"], 100) || collectionName || "unknown",
        createdAt: firstDate(data, ["createdAt", "purchasedAt", "grantedAt", "updatedAt"])
    };
}

function recordMatchesSearch(item, search, keys) {
    const query = normalizeText(search, 120).toLowerCase();
    if (!query) {
        return true;
    }
    return keys.some((key) => normalizeText(getNestedValue(item, key), 240).toLowerCase().includes(query));
}

function sortByRecent(items) {
    return [...items].sort((left, right) => {
        const leftDate = left.createdAt || left.updatedAt || left.lastLoginAt || "";
        const rightDate = right.createdAt || right.updatedAt || right.lastLoginAt || "";
        return String(rightDate).localeCompare(String(leftDate));
    });
}

function paginateItems(items, filters = {}) {
    const limit = normalizeLimit(filters.limit);
    const cursor = normalizeText(filters.cursor, 240);
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

async function readCollectionDocs(db, collectionNames, limit = SUPPORTING_READ_LIMIT) {
    const chunks = await Promise.all(collectionNames.map(async (collectionName) => {
        try {
            const snapshot = await db.collection(collectionName).limit(limit + 1).get();
            const docs = snapshot.docs.slice(0, limit).map((doc) => ({
                collectionName,
                id: doc.id,
                data: doc.data() || {}
            }));
            return {
                docs,
                truncated: snapshot.docs.length > limit
            };
        } catch (error) {
            console.warn(`Admin accounts collection read skipped for ${collectionName}:`, error?.message || error);
            return { docs: [], truncated: false };
        }
    }));

    return {
        docs: chunks.flatMap((chunk) => chunk.docs),
        truncated: chunks.some((chunk) => chunk.truncated)
    };
}

function groupByUser(items = []) {
    const map = new Map();
    for (const item of items) {
        const keys = [item.userId, item.email].map((value) => normalizeText(value, 180).toLowerCase()).filter(Boolean);
        for (const key of keys) {
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(item);
        }
    }
    return map;
}

function getUserGroup(map, user) {
    const keys = [user?.id, user?.userId, user?.uid, user?.email].map((value) => normalizeText(value, 180).toLowerCase()).filter(Boolean);
    const merged = [];
    const seen = new Set();
    for (const key of keys) {
        for (const item of map.get(key) || []) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                merged.push(item);
            }
        }
    }
    return merged;
}

function userIdentityKey(item) {
    return normalizeText(item?.userId, 180).toLowerCase()
        || (normalizeEmail(item?.email) || "").toLowerCase()
        || normalizeText(item?.id, 180).toLowerCase();
}

function buildDisabledAdapter(mode = "local-disabled") {
    const overview = {
        totalUsers: null,
        newUsersToday: null,
        newUsersThisWeek: null,
        premiumUsers: null,
        expiredPremiumUsers: null,
        activeEntitlements: null,
        expiredEntitlements: null
    };
    return {
        mode,
        async overview() {
            return { totals: overview, dataConnected: false };
        },
        async users() {
            return { items: [], nextCursor: null, dataConnected: false };
        },
        async user() {
            return { user: null, dataConnected: false };
        },
        async entitlements() {
            return { items: [], nextCursor: null, dataConnected: false };
        },
        async ownedItems() {
            return { items: [], nextCursor: null, dataConnected: false };
        }
    };
}

function publicEntitlementTypes() {
    return ALLOWED_ENTITLEMENT_TYPES.map((type) => ({
        id: type,
        label: type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    }));
}

function normalizeGrantInput(input = {}, context = {}) {
    requireConfirmation(input.confirmed);
    const reason = requireReason(input.reason);
    const entitlementType = normalizeEntitlementType(input.entitlementType);
    const userEmail = normalizeEmail(input.userEmail);
    const userId = normalizeText(input.userId, 160);
    if (!userEmail && !userId) {
        throw new AdminAccountsError(400, "ENTITLEMENT_USER_REQUIRED", "User email or user id is required.");
    }
    const durationDays = normalizeDurationDays(input.durationDays);
    const expiresAt = input.expiresAt
        ? normalizeFutureDate(input.expiresAt)
        : (durationDays ? expiryFromDuration(durationDays) : null);
    if (!expiresAt) {
        throw new AdminAccountsError(400, "ENTITLEMENT_EXPIRY_REQUIRED", "Manual grants require duration days or an expiry date.");
    }
    const now = new Date().toISOString();
    const docId = makeManualEntitlementId();
    return {
        docId,
        data: {
            id: docId,
            entitlementId: docId,
            userEmail: userEmail || null,
            email: userEmail || null,
            userId: userId || null,
            entitlementType,
            type: entitlementType,
            plan: normalizeText(input.plan, 120) || null,
            productId: normalizeText(input.productId, 160) || null,
            source: "manual_admin",
            status: "active",
            startsAt: now,
            expiresAt,
            durationDays: durationDays || null,
            grantedBy: normalizeEmail(context.adminEmail),
            reason,
            createdAt: now,
            updatedAt: now
        },
        reason
    };
}

function buildRevokePatch(input = {}, context = {}) {
    requireConfirmation(input.confirmed);
    const reason = requireReason(input.reason);
    const now = new Date().toISOString();
    return {
        patch: {
            status: "revoked",
            revokedAt: now,
            revokedBy: normalizeEmail(context.adminEmail),
            revokeReason: reason,
            updatedAt: now
        },
        reason
    };
}

function buildExtendPatch(current = {}, input = {}, context = {}) {
    requireConfirmation(input.confirmed);
    const reason = requireReason(input.reason);
    const currentExpiry = firstDate(current, ["expiresAt", "expiryDate", "expiresOn", "validUntil", "endsAt"]);
    if (!currentExpiry) {
        throw new AdminAccountsError(400, "ENTITLEMENT_NOT_TIME_LIMITED", "Only time-limited entitlements can be extended.");
    }
    const durationDays = normalizeDurationDays(input.durationDays);
    const currentExpiryDate = new Date(currentExpiry);
    const baseDate = currentExpiryDate.getTime() > Date.now() ? currentExpiryDate : new Date();
    const nextExpiry = input.expiresAt
        ? normalizeFutureDate(input.expiresAt)
        : (durationDays ? expiryFromDuration(durationDays, baseDate) : null);
    if (!nextExpiry) {
        throw new AdminAccountsError(400, "ENTITLEMENT_EXPIRY_REQUIRED", "Extension requires duration days or a new expiry date.");
    }
    if (new Date(nextExpiry).getTime() <= currentExpiryDate.getTime()) {
        throw new AdminAccountsError(400, "ENTITLEMENT_EXPIRY_NOT_EXTENDED", "New expiry must be later than the current expiry.");
    }
    const now = new Date().toISOString();
    return {
        patch: {
            expiresAt: nextExpiry,
            status: "active",
            extendedBy: normalizeEmail(context.adminEmail),
            extensionReason: reason,
            updatedAt: now
        },
        reason
    };
}

function buildNotePatch(input = {}, context = {}) {
    const adminNote = normalizeMessage(input.adminNote, 1000) || null;
    const now = new Date().toISOString();
    return {
        patch: {
            adminNote,
            noteUpdatedBy: normalizeEmail(context.adminEmail),
            noteUpdatedAt: now,
            updatedAt: now
        },
        reason: "Admin note updated."
    };
}

async function createLocalAccountsAdapter(rootDir, mode = "local") {
    const dir = path.join(rootDir, LOCAL_ACCOUNTS_DIR);
    const file = path.join(dir, LOCAL_ENTITLEMENTS_FILE);
    const base = buildDisabledAdapter(mode);

    async function readRawEntitlements() {
        try {
            const raw = await fs.readFile(file, "utf8");
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            if (error?.code !== "ENOENT") {
                console.warn("Admin entitlement local store could not be read:", error?.message || error);
            }
            return [];
        }
    }

    async function writeRawEntitlements(items) {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, `${JSON.stringify(items, null, 2)}\n`, "utf8");
    }

    function mapLocalItems(items) {
        return items.map((item) => mapEntitlementToAdminSafeEntitlement({
            collectionName: PRIMARY_ENTITLEMENT_COLLECTION,
            id: normalizeText(item.id || item.entitlementId, 160),
            data: item
        }));
    }

    async function getLocalEntitlement(id) {
        const { collectionName, docId } = parseEntitlementPublicId(id);
        if (collectionName !== PRIMARY_ENTITLEMENT_COLLECTION) {
            throw new AdminAccountsError(404, "ENTITLEMENT_NOT_FOUND", "Entitlement was not found.");
        }
        const items = await readRawEntitlements();
        const index = items.findIndex((item) => normalizeText(item.id || item.entitlementId, 160) === docId);
        if (index < 0) {
            throw new AdminAccountsError(404, "ENTITLEMENT_NOT_FOUND", "Entitlement was not found.");
        }
        return { items, index, beforeRaw: items[index], before: mapLocalItems([items[index]])[0] };
    }

    return {
        ...base,
        mode,
        async overview() {
            const entitlements = mapLocalItems(await readRawEntitlements());
            const activeEntitlements = entitlements.filter((item) => item.status === "active");
            const expiredEntitlements = entitlements.filter((item) => item.status === "expired");
            return {
                totals: {
                    ...(await base.overview()).totals,
                    activeEntitlements: activeEntitlements.length,
                    expiredEntitlements: expiredEntitlements.length,
                    premiumUsers: new Set(activeEntitlements.map(userIdentityKey).filter(Boolean)).size,
                    expiredPremiumUsers: new Set(expiredEntitlements.map(userIdentityKey).filter(Boolean)).size
                },
                dataConnected: true
            };
        },
        async entitlements(filters = {}) {
            const status = normalizeStatus(filters.status, ["active", "expired", "revoked", "all"], "all");
            const type = normalizeText(filters.type, 120).toLowerCase();
            const filtered = mapLocalItems(await readRawEntitlements()).filter((item) => {
                if (status !== "all" && status && item.status !== status) {
                    return false;
                }
                if (type && normalizeText(item.entitlementType, 120).toLowerCase() !== type) {
                    return false;
                }
                return recordMatchesSearch(item, filters.search, ["email", "userId", "entitlementType", "productId"]);
            });
            return {
                ...paginateItems(sortByRecent(filtered), filters),
                dataConnected: true
            };
        },
        async ownedItems() {
            return { items: [], nextCursor: null, dataConnected: true };
        },
        async types() {
            return { items: publicEntitlementTypes(), dataConnected: true };
        },
        async grantEntitlement(input = {}, context = {}) {
            const grant = normalizeGrantInput(input, context);
            const items = await readRawEntitlements();
            items.unshift(grant.data);
            await writeRawEntitlements(items.slice(0, OVERVIEW_READ_LIMIT));
            const after = mapLocalItems([grant.data])[0];
            return { item: after, before: null, after, reason: grant.reason };
        },
        async revokeEntitlement(id, input = {}, context = {}) {
            const current = await getLocalEntitlement(id);
            const { patch, reason } = buildRevokePatch(input, context);
            current.items[current.index] = { ...current.beforeRaw, ...patch };
            await writeRawEntitlements(current.items);
            const after = mapLocalItems([current.items[current.index]])[0];
            return { item: after, before: current.before, after, reason };
        },
        async extendEntitlement(id, input = {}, context = {}) {
            const current = await getLocalEntitlement(id);
            const { patch, reason } = buildExtendPatch(current.beforeRaw, input, context);
            current.items[current.index] = { ...current.beforeRaw, ...patch };
            await writeRawEntitlements(current.items);
            const after = mapLocalItems([current.items[current.index]])[0];
            return { item: after, before: current.before, after, reason };
        },
        async updateEntitlementNote(id, input = {}, context = {}) {
            const current = await getLocalEntitlement(id);
            const { patch, reason } = buildNotePatch(input, context);
            current.items[current.index] = { ...current.beforeRaw, ...patch };
            await writeRawEntitlements(current.items);
            const after = mapLocalItems([current.items[current.index]])[0];
            return { item: after, before: current.before, after, reason };
        }
    };
}

async function createFirebaseAdapter(rootDir) {
    const state = await getAdminState(rootDir);
    if (!state.enabled || !state.auth || !state.db) {
        if (IS_PRODUCTION) {
            throw new AdminAccountsError(503, "ADMIN_ACCOUNTS_STORAGE_NOT_CONFIGURED", "Admin users and access storage is not configured.");
        }
        return createLocalAccountsAdapter(rootDir, state.mode || "local");
    }

    const { auth, db } = state;

    async function loadProfiles() {
        const result = await readCollectionDocs(db, USER_PROFILE_COLLECTIONS, SUPPORTING_READ_LIMIT);
        return {
            items: result.docs.map((record) => ({ ...record, safe: mapUserRecordToAdminSafeUser(record) })),
            truncated: result.truncated
        };
    }

    async function loadEntitlements() {
        const result = await readCollectionDocs(db, ENTITLEMENT_COLLECTIONS, SUPPORTING_READ_LIMIT);
        return {
            items: result.docs.map(mapEntitlementToAdminSafeEntitlement),
            truncated: result.truncated
        };
    }

    async function loadOwnedItems() {
        const result = await readCollectionDocs(db, OWNED_ITEM_COLLECTIONS, SUPPORTING_READ_LIMIT);
        return {
            items: result.docs.map(mapOwnedItemToAdminSafeOwnedItem),
            truncated: result.truncated
        };
    }

    function enrichUsers(users, profiles, entitlements) {
        const profileById = new Map();
        const profileByEmail = new Map();
        for (const profile of profiles.items) {
            const safe = profile.safe;
            if (safe.id) {
                profileById.set(safe.id.toLowerCase(), profile.data);
            }
            if (safe.email && safe.email !== "Unknown") {
                profileByEmail.set(safe.email.toLowerCase(), profile.data);
            }
        }
        const entitlementMap = groupByUser(entitlements.items);
        return users.map((user) => {
            const profile = profileById.get(normalizeText(user.uid, 160).toLowerCase())
                || profileByEmail.get(normalizeEmail(user.email))
                || {};
            const safeBase = mapAuthUserToAdminSafeUser(user, profile, getUserGroup(entitlementMap, {
                id: user.uid,
                email: user.email
            }));
            return safeBase;
        });
    }

    function applyUserFilters(items, filters = {}) {
        const status = normalizeStatus(filters.status, ["active", "expired", "free", "premium", "all"], "all");
        const plan = normalizeText(filters.plan, 80).toLowerCase();
        return items.filter((item) => {
            if (!recordMatchesSearch(item, filters.search, ["email", "displayName", "id"])) {
                return false;
            }
            if (plan && normalizeText(item.plan, 80).toLowerCase() !== plan) {
                return false;
            }
            if (status === "active" || status === "premium") {
                return item.premiumStatus === "active" || item.premiumStatus === "premium";
            }
            if (status === "expired") {
                return item.premiumStatus === "expired";
            }
            if (status === "free") {
                return item.premiumStatus === "free";
            }
            return true;
        });
    }

    async function getEntitlementDocument(id) {
        const { collectionName, docId } = parseEntitlementPublicId(id);
        const ref = db.collection(collectionName).doc(docId);
        const snapshot = await ref.get();
        if (!snapshot.exists) {
            throw new AdminAccountsError(404, "ENTITLEMENT_NOT_FOUND", "Entitlement was not found.");
        }
        const beforeRaw = snapshot.data() || {};
        const before = mapEntitlementToAdminSafeEntitlement({
            collectionName,
            id: snapshot.id,
            data: beforeRaw
        });
        return { ref, collectionName, docId, beforeRaw, before };
    }

    return {
        mode: state.mode,
        async overview() {
            const [authPage, profiles, entitlements] = await Promise.all([
                auth.listUsers(OVERVIEW_READ_LIMIT).catch((error) => {
                    console.warn("Admin accounts auth overview skipped:", error?.message || error);
                    return { users: [], pageToken: null };
                }),
                loadProfiles(),
                loadEntitlements()
            ]);
            const entitlementItems = entitlements.items;
            const activeEntitlements = entitlementItems.filter((item) => item.status === "active");
            const expiredEntitlements = entitlementItems.filter((item) => item.status === "expired");
            const now = Date.now();
            const oneDayAgo = now - 24 * 60 * 60 * 1000;
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
            const exactAuthCount = !authPage.pageToken;
            const users = enrichUsers(authPage.users || [], profiles, entitlements);
            const premiumKeys = new Set(activeEntitlements.map(userIdentityKey).filter(Boolean));
            users.filter((item) => item.premiumStatus === "active" || item.premiumStatus === "premium").forEach((item) => {
                const key = userIdentityKey(item);
                if (key) {
                    premiumKeys.add(key);
                }
            });

            return {
                totals: {
                    totalUsers: exactAuthCount && !profiles.truncated ? Math.max(authPage.users.length, profiles.items.length) : null,
                    newUsersToday: exactAuthCount
                        ? authPage.users.filter((user) => new Date(user.metadata?.creationTime || 0).getTime() >= oneDayAgo).length
                        : null,
                    newUsersThisWeek: exactAuthCount
                        ? authPage.users.filter((user) => new Date(user.metadata?.creationTime || 0).getTime() >= sevenDaysAgo).length
                        : null,
                    premiumUsers: entitlements.truncated || profiles.truncated ? null : premiumKeys.size,
                    expiredPremiumUsers: entitlements.truncated ? null : new Set(expiredEntitlements.map(userIdentityKey).filter(Boolean)).size,
                    activeEntitlements: entitlements.truncated ? null : activeEntitlements.length,
                    expiredEntitlements: entitlements.truncated ? null : expiredEntitlements.length
                },
                dataConnected: true
            };
        },
        async users(filters = {}) {
            const limit = normalizeLimit(filters.limit);
            const search = normalizeText(filters.search, 120);
            let authUsers = [];
            let nextCursor = null;

            if (search.includes("@")) {
                try {
                    authUsers = [await auth.getUserByEmail(search.toLowerCase())];
                } catch (_) {
                    authUsers = [];
                }
            } else {
                const page = await auth.listUsers(limit, normalizeText(filters.cursor, 240) || undefined);
                authUsers = page.users || [];
                nextCursor = page.pageToken || null;
            }

            const [profiles, entitlements] = await Promise.all([loadProfiles(), loadEntitlements()]);
            const entitlementMap = groupByUser(entitlements.items);
            const enriched = enrichUsers(authUsers, profiles, entitlements);
            const seen = new Set(enriched.map((item) => `${item.id}|${item.email}`.toLowerCase()));

            if (!filters.cursor) {
                for (const profile of profiles.items) {
                    const safe = mapUserRecordToAdminSafeUser(profile, getUserGroup(entitlementMap, profile.safe));
                    const key = `${safe.id}|${safe.email}`.toLowerCase();
                    if (!seen.has(key)) {
                        enriched.push(safe);
                        seen.add(key);
                    }
                }
            }

            const filtered = applyUserFilters(sortByRecent(enriched), filters);
            return {
                items: filtered.slice(0, limit),
                nextCursor,
                dataConnected: true
            };
        },
        async user(id) {
            const safeId = normalizeText(id, 180);
            let authUser = null;
            try {
                authUser = await auth.getUser(stripPublicId(safeId));
            } catch (_) {
                if (safeId.includes("@")) {
                    try {
                        authUser = await auth.getUserByEmail(safeId.toLowerCase());
                    } catch (_) {
                        authUser = null;
                    }
                }
            }

            const [profiles, entitlements, ownedItems] = await Promise.all([
                loadProfiles(),
                loadEntitlements(),
                loadOwnedItems()
            ]);
            const entitlementMap = groupByUser(entitlements.items);
            const ownedMap = groupByUser(ownedItems.items);
            const profileRecord = profiles.items.find((item) => {
                const safe = item.safe;
                return safe.id === stripPublicId(safeId)
                    || safe.email.toLowerCase() === safeId.toLowerCase()
                    || safe.id === authUser?.uid
                    || safe.email.toLowerCase() === normalizeEmail(authUser?.email);
            });
            const baseUser = authUser
                ? mapAuthUserToAdminSafeUser(authUser, profileRecord?.data || {}, getUserGroup(entitlementMap, {
                    id: authUser.uid,
                    email: authUser.email
                }))
                : (profileRecord ? mapUserRecordToAdminSafeUser(profileRecord, getUserGroup(entitlementMap, profileRecord.safe)) : null);

            if (!baseUser) {
                return { user: null, dataConnected: true };
            }

            return {
                user: {
                    ...baseUser,
                    entitlements: sortByRecent(getUserGroup(entitlementMap, baseUser)).slice(0, 50),
                    ownedItems: sortByRecent(getUserGroup(ownedMap, baseUser)).slice(0, 50),
                    recentActivitySummary: {
                        entitlements: getUserGroup(entitlementMap, baseUser).length,
                        ownedItems: getUserGroup(ownedMap, baseUser).length
                    }
                },
                dataConnected: true
            };
        },
        async entitlements(filters = {}) {
            const loaded = await loadEntitlements();
            const status = normalizeStatus(filters.status, ["active", "expired", "revoked", "all"], "all");
            const type = normalizeText(filters.type, 120).toLowerCase();
            const filtered = loaded.items.filter((item) => {
                if (status !== "all" && status && item.status !== status) {
                    return false;
                }
                if (type && normalizeText(item.entitlementType, 120).toLowerCase() !== type) {
                    return false;
                }
                return recordMatchesSearch(item, filters.search, ["email", "userId", "entitlementType", "source", "productId"]);
            });
            return {
                ...paginateItems(sortByRecent(filtered), filters),
                dataConnected: true
            };
        },
        async ownedItems(filters = {}) {
            const loaded = await loadOwnedItems();
            const filtered = loaded.items.filter((item) => recordMatchesSearch(item, filters.search, ["email", "userId", "itemId", "title", "category", "source"]));
            return {
                ...paginateItems(sortByRecent(filtered), filters),
                dataConnected: true
            };
        },
        async types() {
            return { items: publicEntitlementTypes(), dataConnected: true };
        },
        async grantEntitlement(input = {}, context = {}) {
            const grant = normalizeGrantInput(input, context);
            const ref = db.collection(PRIMARY_ENTITLEMENT_COLLECTION).doc(grant.docId);
            await ref.set(grant.data);
            const afterSnapshot = await ref.get();
            const after = mapEntitlementToAdminSafeEntitlement({
                collectionName: PRIMARY_ENTITLEMENT_COLLECTION,
                id: afterSnapshot.id,
                data: afterSnapshot.data() || grant.data
            });
            return { item: after, before: null, after, reason: grant.reason };
        },
        async revokeEntitlement(id, input = {}, context = {}) {
            const current = await getEntitlementDocument(id);
            const { patch, reason } = buildRevokePatch(input, context);
            await current.ref.update(patch);
            const updated = await current.ref.get();
            const after = mapEntitlementToAdminSafeEntitlement({
                collectionName: current.collectionName,
                id: updated.id,
                data: updated.data() || {}
            });
            return { item: after, before: current.before, after, reason };
        },
        async extendEntitlement(id, input = {}, context = {}) {
            const current = await getEntitlementDocument(id);
            const { patch, reason } = buildExtendPatch(current.beforeRaw, input, context);
            await current.ref.update(patch);
            const updated = await current.ref.get();
            const after = mapEntitlementToAdminSafeEntitlement({
                collectionName: current.collectionName,
                id: updated.id,
                data: updated.data() || {}
            });
            return { item: after, before: current.before, after, reason };
        },
        async updateEntitlementNote(id, input = {}, context = {}) {
            const current = await getEntitlementDocument(id);
            const { patch, reason } = buildNotePatch(input, context);
            await current.ref.update(patch);
            const updated = await current.ref.get();
            const after = mapEntitlementToAdminSafeEntitlement({
                collectionName: current.collectionName,
                id: updated.id,
                data: updated.data() || {}
            });
            return { item: after, before: current.before, after, reason };
        }
    };
}

function createAdminAccountsStore(rootDir) {
    let adapterPromise = null;

    async function getAdapter() {
        if (!adapterPromise) {
            adapterPromise = createFirebaseAdapter(rootDir);
        }
        return adapterPromise;
    }

    return {
        async getOverview() {
            const adapter = await getAdapter();
            return {
                ...(await adapter.overview()),
                storageMode: adapter.mode
            };
        },
        async listUsers(filters = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.users(filters)),
                storageMode: adapter.mode
            };
        },
        async getUser(id) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.user(id)),
                storageMode: adapter.mode
            };
        },
        async listEntitlements(filters = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.entitlements(filters)),
                storageMode: adapter.mode
            };
        },
        async listOwnedItems(filters = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.ownedItems(filters)),
                storageMode: adapter.mode
            };
        },
        async listEntitlementTypes() {
            const adapter = await getAdapter();
            return {
                ...(await adapter.types()),
                storageMode: adapter.mode
            };
        },
        async grantEntitlement(input = {}, context = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.grantEntitlement(input, context)),
                storageMode: adapter.mode
            };
        },
        async revokeEntitlement(id, input = {}, context = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.revokeEntitlement(id, input, context)),
                storageMode: adapter.mode
            };
        },
        async extendEntitlement(id, input = {}, context = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.extendEntitlement(id, input, context)),
                storageMode: adapter.mode
            };
        },
        async updateEntitlementNote(id, input = {}, context = {}) {
            const adapter = await getAdapter();
            return {
                ...(await adapter.updateEntitlementNote(id, input, context)),
                storageMode: adapter.mode
            };
        }
    };
}

module.exports = {
    AdminAccountsError,
    createAdminAccountsStore,
    mapAuthUserToAdminSafeUser,
    mapEntitlementToAdminSafeEntitlement,
    mapOwnedItemToAdminSafeOwnedItem,
    mapUserRecordToAdminSafeUser
};
