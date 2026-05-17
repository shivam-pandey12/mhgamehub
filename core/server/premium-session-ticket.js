const crypto = require("crypto");

const TOKEN_KIND = "gamehub-premium-session";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 8;
const SESSION_SECRET = String(process.env.PREMIUM_SESSION_TICKET_SECRET || crypto.randomBytes(32).toString("hex"));

function toBase64Url(value) {
    return Buffer.from(String(value || ""), "utf8").toString("base64url");
}

function fromBase64Url(value) {
    return Buffer.from(String(value || ""), "base64url").toString("utf8");
}

function signSegment(segment) {
    return crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(String(segment || ""))
        .digest("base64url");
}

function normalizeSessionPayload(user = {}, options = {}) {
    const now = Date.now();
    const ttlMs = Math.max(60_000, Number(options.ttlMs || DEFAULT_TTL_MS));
    return {
        kind: TOKEN_KIND,
        uid: String(user.uid || "").trim(),
        email: String(user.email || "").trim(),
        displayName: String(user.displayName || "").trim(),
        photoURL: String(user.photoURL || "").trim(),
        provider: String(user.provider || "firebase").trim(),
        projectId: String(user.projectId || "").trim(),
        issuedAt: now,
        expiresAt: now + ttlMs
    };
}

function signPremiumSessionTicket(user, options = {}) {
    const payload = normalizeSessionPayload(user, options);
    if (!payload.uid) {
        throw new Error("Cannot sign a premium session ticket without a user uid.");
    }

    const segment = toBase64Url(JSON.stringify(payload));
    const signature = signSegment(segment);
    return {
        token: `${segment}.${signature}`,
        expiresAt: payload.expiresAt,
        user: {
            uid: payload.uid,
            email: payload.email,
            displayName: payload.displayName,
            photoURL: payload.photoURL,
            provider: payload.provider,
            projectId: payload.projectId
        }
    };
}

function verifyPremiumSessionTicket(token) {
    const raw = String(token || "").trim();
    if (!raw) {
        return null;
    }

    const [segment, signature] = raw.split(".");
    if (!segment || !signature) {
        return null;
    }

    const expectedSignature = signSegment(segment);
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
        return null;
    }

    try {
        const payload = JSON.parse(fromBase64Url(segment));
        if (payload?.kind !== TOKEN_KIND) {
            return null;
        }
        if (!payload?.uid || Number(payload?.expiresAt || 0) <= Date.now()) {
            return null;
        }

        return payload;
    } catch (_) {
        return null;
    }
}

module.exports = {
    DEFAULT_TTL_MS,
    signPremiumSessionTicket,
    verifyPremiumSessionTicket
};
