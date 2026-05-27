import express from 'express';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSocketServer } from './socket-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3001;
const distPath = path.resolve(__dirname, '../dist');
const distIndex = path.join(distPath, 'index.html');

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'carrom-3d-royale-online',
    mode: 'standalone',
    time: Date.now()
  });
});

if (existsSync(distIndex)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/socket.io')) {
      next();
      return;
    }
    res.sendFile(distIndex);
  });
}

createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`3D Carrom Royale online server listening on http://localhost:${PORT}`);
});
