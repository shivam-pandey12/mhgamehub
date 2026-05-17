const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const startingPort = Number(process.env.PORT || 3000);

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mp3": "audio/mpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8"
};

function send(response, statusCode, body, contentType) {
    response.writeHead(statusCode, { "Content-Type": contentType });
    response.end(body);
}

function resolveRequestPath(requestUrl) {
    const safeUrl = new URL(requestUrl, "http://localhost");
    const pathname = decodeURIComponent(safeUrl.pathname === "/" ? "/index.html" : safeUrl.pathname);
    const resolvedPath = path.normalize(path.join(rootDir, pathname));

    if (!resolvedPath.startsWith(rootDir)) {
        return null;
    }

    return resolvedPath;
}

const server = http.createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || "/");
    if (!filePath) {
        send(response, 403, "Forbidden", "text/plain; charset=utf-8");
        return;
    }

    fs.readFile(filePath, (error, fileBuffer) => {
        if (error) {
            if (error.code === "ENOENT") {
                send(response, 404, "Not found", "text/plain; charset=utf-8");
                return;
            }

            send(response, 500, "Server error", "text/plain; charset=utf-8");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extension] || "application/octet-stream";
        send(response, 200, fileBuffer, contentType);
    });
});

let activePort = startingPort;

server.on("error", (error) => {
    if (error && error.code === "EADDRINUSE") {
        activePort += 1;
        server.listen(activePort);
        return;
    }

    throw error;
});

server.on("listening", () => {
    console.log(`Shadow fighter duel running at http://localhost:${activePort}`);
});

server.listen(activePort);
