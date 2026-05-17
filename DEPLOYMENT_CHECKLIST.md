# GameHub Production Deployment Checklist

GameHub deploys from this repository root as a Node/Express app. Keep the root server in place because it owns clean routes, catalog APIs, Socket.IO, premium runtime hooks, cache headers, and private file blocking.

## GitHub-Safe Project Files

Upload these files and folders to GitHub:

- `server.js`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `HOSTING.md`
- `DEPLOYMENT_CHECKLIST.md`
- `scripts/`
- `core/server/`
- `core/player/`
- `systems/`
- `assets/`
- `games/`
- `game-details/`
- `premium/`
- `gamehub.html`
- `gamehub.js`
- `gamehub.css`
- `game-renderer.html`
- `new-game-renderer.html`
- `gamehub-socket.js`
- `games-manifest.js`
- `documentation.html`
- `legal.html`

Built game `dist` folders should stay in the repo when the catalog points to them. Do not ignore those dist folders unless the deployment pipeline rebuilds every affected game before start.

If a premium game folder exists on the VPS but does not appear in `/api/premium-games-catalog`, check that its catalog entry file exists exactly, for example `premium/premium-games/chess-codex/dist/index.html`. The registry intentionally hides games whose playable entry file is missing.

## Keep Local or Inject on the VPS

Do not upload these to GitHub or public hosting:

- `node_modules/`
- `.env`, `.env.*`, `*.env`
- `firebase_credentials/`
- `premium/firebase_credentials`
- any nested `firebase_credentials/` or `firebase credentials/`
- `serviceAccount.json`, `serviceAccount*.json`, `*service-account*.json`
- `google-services.json`, `adminsdk*.json`, private keys, `.pem`, `.key`, `.crt`
- `logs/`, `*.log`, `*.out.log`, `*.err.log`
- `.vite/`, `.cache/`, `coverage/`
- `.codex-verify/`, browser profiles, local test output
- premium runtime local state such as `premium/premium-games/**/server/data/` and `premium/premium-games/**/backend/data/`

## Required Production Environment

Create a real `.env` on the VPS from `.env.example` and fill production values:

```text
NODE_ENV=production
PORT=3000
GAMEHUB_ALLOWED_ORIGINS=https://gamehub.mhhorizons.com
PREMIUM_SESSION_TICKET_SECRET=replace-with-a-long-random-production-secret
GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS=premium/firebase_credentials/config.js
```

`GAMEHUB_ALLOWED_ORIGINS` can be comma-separated. `GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS` must point to a readable file, not the `premium/firebase_credentials/` directory. The file should contain a browser Firebase config assignment such as:

```js
const firebaseConfig = {
  apiKey: "replace-with-web-api-key",
  authDomain: "replace-with-auth-domain",
  projectId: "replace-with-project-id",
  appId: "replace-with-app-id"
};
```

This file can also live at an absolute path outside the repo if your server stores secrets elsewhere. The backend exposes only the parsed browser config through `/api/premium-auth/config`; do not make the raw credential directory public.

## VPS Command Sequence

```bash
git clone https://github.com/YOUR_ACCOUNT/YOUR_GAMEHUB_REPO.git gamehub
cd gamehub
cp .env.example .env
nano .env
npm ci
npm run hosting:audit
NODE_ENV=production npm start
```

If Git says a required built premium `dist` folder is ignored, remove the nested `dist` ignore first, then add the built output:

```bash
git add premium/premium-games/*/dist premium/premium-games/*/*/dist
git status --short
```

For a long-running VPS process with PM2:

```bash
npm install -g pm2
pm2 start server.js --name gamehub --update-env
pm2 save
pm2 startup
```

For Nginx, proxy the domain to `127.0.0.1:3000` and preserve WebSocket upgrade headers for Socket.IO:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## Smoke Test Routes

After deployment, confirm these routes return successfully:

- `/`
- `/gamehub`
- `/play`
- `/game-renderer`
- `/premium`
- `/premium/login`
- `/api/health`
- `/api/games-catalog`
- `/api/premium-games-catalog`
- `/socket.io/socket.io.js`
- `/api/premium-runtime/chess/health`
- `/api/premium-runtime/handcricket/health`
- `/api/premium-runtime/ludo/health`

Confirm these private paths stay blocked with `404`:

- `/.env`
- `/firebase_credentials/config.js`
- `/premium/firebase_credentials`
- `/premium/firebase_credentials/config.js`
- `/premium/firebase_credentials/serviceAccount.json`
- `/serviceAccount.json`
- `/core/server/create-server.js`
- `/models/User.js`
- `/node_modules/express/package.json`
- `/game-details/2048.json`
 
