const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4178);
const host = process.env.HOST || '127.0.0.1';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const route = rawPath === '/' ? '/index.html' : rawPath;
  const file = path.normalize(path.join(root, route));

  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, 'index.html'), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        res.writeHead(200, {
          'Content-Type': types['.html'],
          'Cache-Control': 'no-store'
        });
        res.end(fallback);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Train Roof Rush preview: http://${host}:${port}/`);
});
