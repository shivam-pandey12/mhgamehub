const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const includeCredentials = process.argv.includes("--include-credentials");
const skipCredentialBackup = process.argv.includes("--no-credential-backup");
const backupDir = path.join(rootDir, ".hosting-clean-backup", new Date().toISOString().replace(/[:.]/g, "-"));
const roots = ["games", "premium"]
    .map((entry) => path.join(rootDir, entry))
    .filter((entry) => fs.existsSync(entry));

const logFilePattern = /(\.log|\.out\.log|\.err\.log)$/i;
const credentialFilePattern = /(firebase[_\s-]?credentials|service[_-]?account\.json|google-services\.json|adminsdk)/i;
const profileDirectoryNames = new Set([
    ".headless-edge-profile",
    ".__chrome_profile",
    ".__chrome_profile2",
    ".edge-ludo-desktop"
]);

const filesToDelete = [];
const directoriesToDelete = [];

function assertInsideWorkspace(targetPath) {
    const resolved = path.resolve(targetPath);
    if (resolved !== rootDir && !resolved.startsWith(`${rootDir}${path.sep}`)) {
        throw new Error(`Refusing to delete outside workspace: ${resolved}`);
    }
    return resolved;
}

function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);
        const resolved = assertInsideWorkspace(absolutePath);

        if (entry.isDirectory()) {
            if (profileDirectoryNames.has(entry.name)) {
                directoriesToDelete.push(resolved);
                continue;
            }

            if (entry.name === "node_modules" || entry.name === ".git") {
                continue;
            }

            walk(resolved);
            continue;
        }

        if (logFilePattern.test(entry.name)) {
            filesToDelete.push(resolved);
            continue;
        }

        if (includeCredentials && credentialFilePattern.test(entry.name)) {
            filesToDelete.push(resolved);
        }
    }
}

for (const root of roots) {
    walk(root);
}

const uniqueFiles = [...new Set(filesToDelete)].sort();
const uniqueDirectories = [...new Set(directoriesToDelete)]
    .sort((a, b) => b.length - a.length);

if (!uniqueFiles.length && !uniqueDirectories.length) {
    console.log("No hosting baggage found.");
    process.exit(0);
}

console.log("Removing hosting baggage:");
for (const filePath of uniqueFiles) {
    if (includeCredentials && !skipCredentialBackup && credentialFilePattern.test(path.basename(filePath))) {
        const backupPath = path.join(backupDir, path.relative(rootDir, filePath));
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        fs.copyFileSync(filePath, backupPath);
        console.log(`   backed up ${path.relative(rootDir, filePath)} to ${path.relative(rootDir, backupPath)}`);
    }

    fs.rmSync(filePath, { force: true });
    console.log(` - ${path.relative(rootDir, filePath)}`);
}

for (const directoryPath of uniqueDirectories) {
    fs.rmSync(directoryPath, { recursive: true, force: true });
    console.log(` - ${path.relative(rootDir, directoryPath)}`);
}

if (!includeCredentials) {
    console.log("");
    console.log("Credential-like files were left untouched. Run with --include-credentials to remove them too.");
}
