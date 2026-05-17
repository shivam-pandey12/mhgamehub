(function attachStorageManager() {
    "use strict";

    const DEFAULT_GAME_MIGRATIONS = {
        "2048": {
            bestScore: ["bestScore"],
            darkMode: ["darkMode"]
        }
    };

    class StorageManager {
        constructor(options = {}) {
            this.storage = options.storage || window.localStorage;
            this.gameMigrations = {
                ...DEFAULT_GAME_MIGRATIONS,
                ...(options.gameMigrations || {})
            };
        }

        readText(key, fallback = null) {
            try {
                const value = this.storage.getItem(key);
                return value == null ? fallback : value;
            } catch (_) {
                return fallback;
            }
        }

        writeText(key, value) {
            try {
                this.storage.setItem(key, String(value));
                return true;
            } catch (_) {
                return false;
            }
        }

        remove(key) {
            try {
                this.storage.removeItem(key);
                return true;
            } catch (_) {
                return false;
            }
        }

        readJson(key, fallback) {
            const raw = this.readText(key);
            if (raw == null) {
                return fallback;
            }

            try {
                return JSON.parse(raw);
            } catch (_) {
                return fallback;
            }
        }

        writeJson(key, value) {
            return this.writeText(key, JSON.stringify(value));
        }

        getNamespace(game) {
            const explicit = String(game?.storageNamespace || "").trim();
            if (explicit) {
                return explicit;
            }

            const gameId = String(game?.id || "game").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
            return `gamehub.${gameId}`;
        }

        getGameKey(game, suffix) {
            return `${this.getNamespace(game)}.${suffix}`;
        }

        getLegacyKeys(game, logicalKey, options = {}) {
            const explicit = Array.isArray(options.legacyKeys) ? options.legacyKeys : [];
            if (explicit.length) {
                return explicit;
            }

            const perGame = this.gameMigrations[String(game?.id || "")] || {};
            return Array.isArray(perGame[logicalKey]) ? perGame[logicalKey] : [];
        }

        migrateLegacyValue(game, logicalKey, options = {}) {
            const namespacedKey = this.getGameKey(game, logicalKey);
            const existingValue = this.readText(namespacedKey);
            if (existingValue != null) {
                return existingValue;
            }

            const legacyKeys = this.getLegacyKeys(game, logicalKey, options);
            for (const legacyKey of legacyKeys) {
                const legacyValue = this.readText(legacyKey);
                if (legacyValue != null) {
                    this.writeText(namespacedKey, legacyValue);
                    return legacyValue;
                }
            }

            return null;
        }

        migrateKnownKeys(game) {
            const logicalKeys = Object.keys(this.gameMigrations[String(game?.id || "")] || {});
            logicalKeys.forEach((logicalKey) => this.migrateLegacyValue(game, logicalKey));
        }

        readGameValue(game, logicalKey, fallback = null, options = {}) {
            const namespacedKey = this.getGameKey(game, logicalKey);
            const migratedValue = this.migrateLegacyValue(game, logicalKey, options);
            const value = migratedValue != null ? migratedValue : this.readText(namespacedKey, fallback);
            return value == null ? fallback : value;
        }

        writeGameValue(game, logicalKey, value, options = {}) {
            const namespacedKey = this.getGameKey(game, logicalKey);
            this.writeText(namespacedKey, value);

            if (options.mirrorLegacy === true) {
                this.getLegacyKeys(game, logicalKey, options).forEach((legacyKey) => {
                    this.writeText(legacyKey, value);
                });
            }
        }

        removeGameValue(game, logicalKey, options = {}) {
            this.remove(this.getGameKey(game, logicalKey));
            this.getLegacyKeys(game, logicalKey, options).forEach((legacyKey) => {
                this.remove(legacyKey);
            });
        }
    }

    const platform = window.GameHubPlatform || (window.GameHubPlatform = {});
    platform.StorageManager = {
        StorageManager,
        create(options) {
            return new StorageManager(options);
        }
    };
})();
