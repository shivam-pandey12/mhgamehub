const { verifyPremiumSessionTicket } = require("./premium-session-ticket");

const LOCAL_DEV_ADMIN_EMAIL = "shivam63pandey@gmail.com";

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function parseAdminEmails(value = process.env.ADMIN_EMAILS) {
    const configured = String(value || "").trim();
    // Local/dev bootstrap only. Production must set ADMIN_EMAILS explicitly.
    const source = configured || (process.env.NODE_ENV === "production" ? "" : LOCAL_DEV_ADMIN_EMAIL);
    return new Set(
        source
            .split(",")
            .map(normalizeEmail)
            .filter(Boolean)
    );
}

function extractBearerToken(req) {
    const header = String(req?.headers?.authorization || "").trim();
    const match = header.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : "";
}

function isAdminEmail(email, options = {}) {
    const adminEmails = options.adminEmails instanceof Set
        ? options.adminEmails
        : parseAdminEmails(options.adminEmails);
    return adminEmails.has(normalizeEmail(email));
}

function authenticateAdminRequest(req, options = {}) {
    const token = extractBearerToken(req);
    if (!token) {
        return {
            ok: false,
            status: 401,
            code: "ADMIN_LOGIN_REQUIRED",
            message: "Admin login required."
        };
    }

    const session = verifyPremiumSessionTicket(token);
    if (!session?.uid) {
        return {
            ok: false,
            status: 401,
            code: "ADMIN_LOGIN_REQUIRED",
            message: "Admin login required."
        };
    }

    const email = normalizeEmail(session.email);
    if (!email || !isAdminEmail(email, options)) {
        return {
            ok: false,
            status: 403,
            code: "ADMIN_ACCESS_DENIED",
            message: "Access denied.",
            email
        };
    }

    return {
        ok: true,
        admin: true,
        email,
        session
    };
}

module.exports = {
    LOCAL_DEV_ADMIN_EMAIL,
    authenticateAdminRequest,
    extractBearerToken,
    isAdminEmail,
    normalizeEmail,
    parseAdminEmails
};
