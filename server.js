const platformServer = require("./core/server/create-server");

if (require.main === module) {
    const port = process.env.PORT || 3000;
    Promise.resolve(platformServer.ready)
        .then(() => {
            platformServer.httpServer.listen(port, () => {
                console.log(`GameHub server with realtime support is running at http://localhost:${port}`);
            });
        })
        .catch((error) => {
            console.error("Premium runtime initialization failed:", error);
            process.exitCode = 1;
        });
}

module.exports = platformServer;
