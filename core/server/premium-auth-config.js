const fs = require("fs");
const path = require("path");

const REQUIRED_FIREBASE_KEYS = [
    "apiKey",
    "authDomain",
    "projectId",
    "appId"
];

const DEFAULT_CREDENTIALS_DIRECTORY = path.join("premium", "firebase_credentials");
const DEFAULT_CREDENTIALS_FILE = path.join(DEFAULT_CREDENTIALS_DIRECTORY, "config.js");
const LEGACY_CREDENTIALS_FILE = DEFAULT_CREDENTIALS_DIRECTORY;
const ACCEPTED_CONFIG_FORMAT_MESSAGE = "Expected Firebase Web App config, either JSON or a JavaScript assignment such as: const firebaseConfig = { apiKey: \"...\", authDomain: \"...\", projectId: \"...\", appId: \"...\" };";

function toPortablePath(filePath) {
    return String(filePath || "").replace(/\\/g, "/");
}

function toDisplayPath(rootDir, filePath) {
    const relative = path.relative(rootDir, filePath);
    if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
        return toPortablePath(relative);
    }

    return "the configured credentials path";
}

function extractFirebaseConfigObject(fileText) {
    const source = String(fileText || "");
    const trimmed = source.trim();
    if (trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed);
            const config = parsed?.firebaseConfig || parsed;
            if (config && typeof config === "object") {
                return Object.fromEntries(
                    Object.entries(config).filter(([, value]) => typeof value === "string")
                );
            }
        } catch (_) {
            // Fall through to the JavaScript assignment parser below.
        }
    }

    const assignmentMatch = [
        /firebaseConfig\s*=\s*\{([\s\S]*?)\}\s*;?/i,
        /firebaseConfig\s*:\s*\{([\s\S]*?)\}/i
    ]
        .map((pattern) => source.match(pattern))
        .find(Boolean);

    const defaultExportMatch = source.match(/export\s+default\s+\{([\s\S]*?)\}\s*;?/i);
    const objectBody = assignmentMatch?.[1] || defaultExportMatch?.[1] || "";
    if (!objectBody) {
        return null;
    }

    const config = {};
    const entryPattern = /["'`]?([A-Za-z0-9_]+)["'`]?\s*:\s*["'`]([^"'`]*)["'`]/g;
    let entryMatch = entryPattern.exec(objectBody);

    while (entryMatch) {
        config[entryMatch[1]] = entryMatch[2];
        entryMatch = entryPattern.exec(objectBody);
    }

    return Object.keys(config).length ? config : null;
}

function resolveExistingCredentialsFile(candidatePath, rootDir) {
    const displayPath = toDisplayPath(rootDir, candidatePath);
    if (!fs.existsSync(candidatePath)) {
        return {
            exists: false,
            filePath: candidatePath,
            warning: null,
            error: `Premium Firebase credentials file was not found at ${displayPath}.`
        };
    }

    const stat = fs.statSync(candidatePath);
    if (stat.isDirectory()) {
        const configPath = path.join(candidatePath, "config.js");
        const displayConfigPath = toDisplayPath(rootDir, configPath);
        if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
            return {
                exists: true,
                filePath: configPath,
                warning: `GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS points to a directory; using ${displayConfigPath}. Set the env var directly to that file on production.`,
                error: null
            };
        }

        return {
            exists: false,
            filePath: configPath,
            warning: null,
            error: `GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS points to a directory. Expected a readable config.js file inside ${displayPath}.`
        };
    }

    if (!stat.isFile()) {
        return {
            exists: false,
            filePath: candidatePath,
            warning: null,
            error: `Premium Firebase credentials path is not a regular file: ${displayPath}.`
        };
    }

    return {
        exists: true,
        filePath: candidatePath,
        warning: null,
        error: null
    };
}

function resolvePremiumFirebaseCredentialsPath(rootDir) {
    const overridePath = String(process.env.GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS || "").trim();
    if (overridePath) {
        const candidatePath = path.isAbsolute(overridePath)
            ? overridePath
            : path.resolve(rootDir, overridePath);
        return resolveExistingCredentialsFile(candidatePath, rootDir);
    }

    const defaultFilePath = path.join(rootDir, DEFAULT_CREDENTIALS_FILE);
    if (fs.existsSync(defaultFilePath)) {
        return resolveExistingCredentialsFile(defaultFilePath, rootDir);
    }

    return resolveExistingCredentialsFile(path.join(rootDir, LEGACY_CREDENTIALS_FILE), rootDir);
}

function readPremiumFirebaseConfig(rootDir) {
    const resolved = resolvePremiumFirebaseCredentialsPath(rootDir);
    const filePath = resolved.filePath;
    if (!resolved.exists) {
        return {
            configured: false,
            config: null,
            error: resolved.error,
            warning: resolved.warning,
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
                error: `Premium Firebase credentials file did not contain a readable firebaseConfig object. ${ACCEPTED_CONFIG_FORMAT_MESSAGE}`,
                warning: resolved.warning,
                filePath
            };
        }

        const missingKeys = REQUIRED_FIREBASE_KEYS.filter((key) => !String(config[key] || "").trim());
        if (missingKeys.length) {
            return {
                configured: false,
                config: null,
                error: `Premium Firebase credentials are incomplete. Missing: ${missingKeys.join(", ")}.`,
                warning: resolved.warning,
                filePath
            };
        }

        return {
            configured: true,
            config,
            error: null,
            warning: resolved.warning,
            filePath
        };
    } catch (error) {
        return {
            configured: false,
            config: null,
            error: `Failed to read premium Firebase credentials from ${toDisplayPath(rootDir, filePath)}: ${error?.message || "unknown error"}`,
            warning: resolved.warning,
            filePath
        };
    }
}

module.exports = {
    resolvePremiumFirebaseCredentialsPath,
    readPremiumFirebaseConfig
};
