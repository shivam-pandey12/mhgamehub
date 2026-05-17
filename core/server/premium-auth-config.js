const fs = require("fs");
const path = require("path");

const REQUIRED_FIREBASE_KEYS = [
    "apiKey",
    "authDomain",
    "projectId",
    "appId"
];

function extractFirebaseConfigObject(fileText) {
    const match = String(fileText || "").match(/firebaseConfig\s*=\s*\{([\s\S]*?)\}\s*;/i);
    if (!match) {
        return null;
    }

    const objectBody = match[1];
    const config = {};
    const entryPattern = /([A-Za-z0-9_]+)\s*:\s*["'`]([^"'`]*)["'`]/g;
    let entryMatch = entryPattern.exec(objectBody);

    while (entryMatch) {
        config[entryMatch[1]] = entryMatch[2];
        entryMatch = entryPattern.exec(objectBody);
    }

    return Object.keys(config).length ? config : null;
}

function resolvePremiumFirebaseCredentialsPath(rootDir) {
    const overridePath = String(process.env.GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS || "").trim();
    if (!overridePath) {
        return path.join(rootDir, "premium", "firebase_credentials");
    }

    return path.isAbsolute(overridePath)
        ? overridePath
        : path.resolve(rootDir, overridePath);
}

function readPremiumFirebaseConfig(rootDir) {
    const filePath = resolvePremiumFirebaseCredentialsPath(rootDir);
    if (!fs.existsSync(filePath)) {
        return {
            configured: false,
            config: null,
            error: "Premium Firebase credentials file was not found.",
            filePath
        };
    }

    try {
        const source = fs.readFileSync(filePath, "utf8");
        const config = extractFirebaseConfigObject(source);
        if (!config) {
            return {
                configured: false,
                config: null,
                error: "Premium Firebase credentials file did not contain a readable firebaseConfig object.",
                filePath
            };
        }

        const missingKeys = REQUIRED_FIREBASE_KEYS.filter((key) => !String(config[key] || "").trim());
        if (missingKeys.length) {
            return {
                configured: false,
                config: null,
                error: `Premium Firebase credentials are incomplete. Missing: ${missingKeys.join(", ")}.`,
                filePath
            };
        }

        return {
            configured: true,
            config,
            error: null,
            filePath
        };
    } catch (error) {
        return {
            configured: false,
            config: null,
            error: error?.message || "Failed to read premium Firebase credentials.",
            filePath
        };
    }
}

module.exports = {
    resolvePremiumFirebaseCredentialsPath,
    readPremiumFirebaseConfig
};
