const fs = require("fs");
const path = require("path");

const { PREMIUM_GAME_DEFINITIONS, createPremiumRegistry } = require("../core/server/premium-registry");
const { readPremiumFirebaseConfig, resolvePremiumFirebaseCredentialsPath } = require("../core/server/premium-auth-config");

const rootDir = path.resolve(__dirname, "..");

function portable(relativeOrAbsolutePath) {
    const absolutePath = path.isAbsolute(relativeOrAbsolutePath)
        ? relativeOrAbsolutePath
        : path.resolve(rootDir, relativeOrAbsolutePath);
    const relativePath = path.relative(rootDir, absolutePath);
    if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
        return relativePath.replace(/\\/g, "/");
    }
    return absolutePath.replace(/\\/g, "/");
}

function inspectPath(relativePath) {
    const absolutePath = path.resolve(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
        return "missing";
    }
    const stat = fs.statSync(absolutePath);
    if (stat.isDirectory()) {
        return "directory";
    }
    if (stat.isFile()) {
        return "file";
    }
    return "other";
}

function resolveDefinitionEntry(definition) {
    const folderPath = definition.folderPath || path.posix.join("premium", "premium-games", definition.folderName || "");
    return definition.preferredEntryPath || path.posix.join(folderPath, definition.preferredEntry || "dist/index.html");
}

function getExpectedPremiumFolders() {
    return new Set(
        PREMIUM_GAME_DEFINITIONS
            .map((definition) => resolveDefinitionEntry(definition))
            .filter((entryPath) => entryPath.startsWith("premium/premium-games/"))
            .map((entryPath) => entryPath.slice("premium/premium-games/".length).split("/")[0])
    );
}

function listPremiumFolders() {
    const premiumRoot = path.join(rootDir, "premium", "premium-games");
    if (!fs.existsSync(premiumRoot)) {
        return [];
    }
    return fs.readdirSync(premiumRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== "premium_game_image")
        .map((entry) => entry.name)
        .sort();
}

async function main() {
    const envPath = String(process.env.GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS || "").trim();
    const rawEnvPath = envPath || "(not set)";
    const resolvedFirebase = resolvePremiumFirebaseCredentialsPath(rootDir);
    const firebaseConfig = readPremiumFirebaseConfig(rootDir);

    console.log("GameHub production diagnostics");
    console.log(`root: ${portable(rootDir)}`);
    console.log("");
    console.log("Firebase");
    console.log(`- GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS: ${rawEnvPath}`);
    if (envPath) {
        console.log(`- raw env path kind: ${inspectPath(envPath)}`);
    }
    console.log(`- resolved config path: ${portable(resolvedFirebase.filePath)}`);
    console.log(`- resolved config path kind: ${inspectPath(resolvedFirebase.filePath)}`);
    console.log(`- configured: ${firebaseConfig.configured ? "yes" : "no"}`);
    if (firebaseConfig.warning) {
        console.log(`- warning: ${firebaseConfig.warning}`);
    }
    if (firebaseConfig.error) {
        console.log(`- error: ${firebaseConfig.error}`);
    }
    if (firebaseConfig.config) {
        console.log(`- config keys: ${Object.keys(firebaseConfig.config).sort().join(", ")}`);
    }

    const premiumFolders = listPremiumFolders();
    const expectedFolders = getExpectedPremiumFolders();
    const unregisteredFolders = premiumFolders.filter((folderName) => !expectedFolders.has(folderName));
    const catalog = await createPremiumRegistry(rootDir).listGames({ force: true });

    console.log("");
    console.log("Premium folders");
    console.log(`- folders on disk: ${premiumFolders.length ? premiumFolders.join(", ") : "(none)"}`);
    if (unregisteredFolders.length) {
        console.log(`- folders not registered: ${unregisteredFolders.join(", ")}`);
    }

    console.log("");
    console.log(`Premium catalog entries: ${catalog.length}`);
    for (const definition of PREMIUM_GAME_DEFINITIONS) {
        const entryPath = resolveDefinitionEntry(definition);
        const exists = fs.existsSync(path.join(rootDir, entryPath));
        const inCatalog = catalog.some((game) => game.id === definition.id);
        console.log(`- ${definition.id}: ${inCatalog ? "catalog" : "hidden"}; ${exists ? "exists" : "missing"}; ${entryPath}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
