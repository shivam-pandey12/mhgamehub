# GameHub Hosting Guide

This repo should be deployed as the root of a Node/Express app. Do not move the games into a separate static-only folder unless the server code is changed to match; the current server owns clean routes, catalog APIs, Socket.IO, premium runtime hooks, cache headers, and private file blocking.

## Start Command

```powershell
npm ci
npm start
```

The server uses `PORT` when the host provides it. For production, set:

```text
NODE_ENV=production
PORT=3000
GAMEHUB_ALLOWED_ORIGINS=https://your-domain.example
PREMIUM_SESSION_TICKET_SECRET=replace-with-a-long-random-production-secret
GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS=premium/firebase_credentials/config.js
```

If premium Firebase login must work on the host, provide the Firebase browser config through the hosting platform's secret/file injection flow. `GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS` must point to a readable file, not a directory. The expected file shape is a JavaScript assignment containing `apiKey`, `authDomain`, `projectId`, and `appId`, for example `const firebaseConfig = { ... };`. The path can be absolute and outside the repo on a VPS. Do not commit or upload workstation credential files.

## Deploy From This Root

Keep these parts together:

- `server.js`, `package.json`, and `package-lock.json`
- `core/server` for routes, catalogs, auth, and realtime runtime mounting
- `core/player`, `systems`, and `assets` for shared browser/player code
- `gamehub.html`, `documentation.html`, `legal.html`, `gamehub.js`, `gamehub.css`, `game-renderer.html`, `new-game-renderer.html`, `gamehub-socket.js`, and `games-manifest.js`
- `game-details` for server-side catalog metadata
- `games` with playable HTML entries, media, vendor assets, and built `dist` folders
- `premium` with the premium shell, premium images, built game entries, and mounted runtime server folders
- `.env.example`, `HOSTING.md`, `DEPLOYMENT_CHECKLIST.md`, and `scripts/hosting-audit.js` for deployment safety

Do not deploy local-only material:

- `node_modules` folders
- `.env` files and credential JSON/files
- log files and browser profiles
- local runtime state under premium game server data folders
- dev-only caches such as `.vite`, `.cache`, and coverage output
- `.codex-verify` and other local browser runtime output

## Before Hosting

Run the read-only audit:

```powershell
npm run hosting:audit
```

The audit checks that the server structure is present, catalogs resolve to real game entries, public/private file boundaries are still correct, and local deployment baggage is visible as warnings.

## Smoke Test After Deploy

Open these routes on the deployed domain:

```text
/api/health
/api/games-catalog
/api/premium-games-catalog
/socket.io/socket.io.js
/gamehub
/play
/game-renderer
/documentation
/documentation#premium-library
/premium
/premium/login
/api/premium-runtime/chess/health
/api/premium-runtime/handcricket/health
/api/premium-runtime/ludo/health
/legal
/legal/privacy
/legal/terms
```

Private paths should stay blocked:

```text
/core/server/create-server.js
/game-details/2048.json
/models/User.js
/node_modules/express/package.json
/.env
/firebase_credentials/config.js
/premium/firebase_credentials
/premium/firebase_credentials/config.js
/premium/firebase_credentials/serviceAccount.json
/serviceAccount.json
```
