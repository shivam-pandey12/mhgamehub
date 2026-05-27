const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const PREMIUM_RUNTIME_DEFINITIONS = [
    {
        id: "spaceship-race",
        modulePath: ["premium", "premium-games", "3d-spaceship-race", "server", "multiplayerServer.js"],
        exportName: "registerPremiumSpaceshipRuntime",
        namespace: "/premium-spaceship-race",
        healthPath: "/api/premium-runtime/spaceship-race/health"
    },
    {
        id: "carrom-3d",
        modulePath: ["premium", "premium-games", "carron3d_new", "server", "socket-server.js"],
        exportName: "registerPremiumCarromRuntime",
        namespace: "/premium-carrom",
        healthPath: "/api/premium-runtime/carrom/health"
    },
    {
        id: "imperial-chess",
        modulePath: ["premium", "premium-games", "chess-codex", "server", "index.js"],
        exportName: "registerPremiumChessRuntime",
        namespace: "/premium-chess",
        healthPath: "/api/premium-runtime/chess/health"
    },
    {
        id: "handrex",
        modulePath: ["premium", "premium-games", "handcricket", "backend", "server.js"],
        exportName: "registerPremiumHandcricketRuntime",
        namespace: "/premium-handcricket",
        infoPath: "/api/premium-runtime/handcricket",
        healthPath: "/api/premium-runtime/handcricket/health"
    },
    {
        id: "ludo-3d-royale",
        modulePath: ["premium", "premium-games", "3d-ludo", "3d-ludo-royale", "server", "index.js"],
        exportName: "registerPremiumLudoRuntime",
        namespace: "/premium-ludo",
        healthPath: "/api/premium-runtime/ludo/health"
    },
    {
        id: "snake-ladder-3d-royale",
        modulePath: ["premium", "premium-games", "3d-snake-and-ladder", "server", "index.js"],
        exportName: "registerPremiumSnakeLadderRuntime",
        namespace: "/premium-snake-ladder",
        infoPath: "/api/premium-runtime/snake-ladder",
        healthPath: "/api/premium-runtime/snake-ladder/health"
    },
    {
        id: "golf-3d",
        modulePath: ["premium", "premium-games", "3d-golf", "server", "index.js"],
        exportName: "registerPremiumGolfRuntime",
        namespace: "/premium-golf",
        healthPath: "/api/premium-runtime/golf/health"
    }
];

async function importRuntimeModule(moduleAbsolutePath) {
    return import(pathToFileURL(moduleAbsolutePath).href);
}

async function initializePremiumRuntime({ app, io, rootDir }) {
    const mounted = [];

    for (const definition of PREMIUM_RUNTIME_DEFINITIONS) {
        const absolutePath = path.join(rootDir, ...definition.modulePath);
        if (!fs.existsSync(absolutePath)) {
            continue;
        }

        const runtimeModule = await importRuntimeModule(absolutePath);
        const registerRuntime = runtimeModule?.[definition.exportName];
        if (typeof registerRuntime !== "function") {
            throw new Error(`Premium runtime ${definition.id} did not export ${definition.exportName}.`);
        }

        const namespace = io.of(definition.namespace);
        registerRuntime({
            app,
            io: namespace,
            namespace: definition.namespace,
            healthPath: definition.healthPath,
            infoPath: definition.infoPath
        });

        mounted.push({
            id: definition.id,
            namespace: definition.namespace,
            module: absolutePath
        });
    }

    return mounted;
}

module.exports = {
    initializePremiumRuntime
};
