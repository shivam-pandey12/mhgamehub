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
ADMIN_EMAILS=shivam63pandey@gmail.com
PREMIUM_SESSION_TICKET_SECRET=replace-with-a-long-random-production-secret
GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS=premium/firebase_credentials/config.js
GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT=premium/firebase_credentials/serviceAccount.json
MULTIPLAYER_ALLOWED_ORIGINS=https://your-domain.example
ALLOW_INSECURE_LOCAL_AUTH=false
```

If premium Firebase login must work on the host, provide the Firebase browser config through the hosting platform's secret/file injection flow. `GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS` must point to a readable file, not a directory. The expected file shape is a JavaScript assignment containing `apiKey`, `authDomain`, `projectId`, and `appId`, for example `const firebaseConfig = { ... };`. The path can be absolute and outside the repo on a VPS. Do not commit or upload workstation credential files.

Set `ADMIN_EMAILS` explicitly in production. It accepts a comma-separated list and is checked server-side against signed Premium GameHub session tickets. The built-in first-admin fallback is local/dev only.

For 3D Spaceship Race multiplayer, also provide a private Firebase Admin service account path through `GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT` or `GOOGLE_APPLICATION_CREDENTIALS`. This file is server-only and must stay outside public routes and GitHub.

Game feedback storage uses Firestore when a Firebase Admin service account is configured through the same server-only credentials. Local development can fall back to `.gamehub-data/feedback-reports.json`; keep `.gamehub-data/` private and never upload it as public static content.

Internal analytics storage also uses Firebase Admin credentials for Firestore. Local development can fall back to `.gamehub-data/analytics.json`; production should provide Firestore credentials instead of relying on local JSON.

The admin Users and Access tabs use the same Firebase Admin service account for read-only Auth and Firestore visibility. Payments are not connected in the current GameHub build; the admin payment endpoint stays protected but returns a disabled/not-connected response for admins.

Phase 5 admin audit logs and manual support entitlements also use Firebase Admin credentials. Local development can fall back to `.gamehub-data/admin-audit-logs.json` and `.gamehub-data/admin-entitlements.json`; production should provide Firestore credentials instead of relying on local JSON.

## Deploy From This Root

Keep these parts together:

- `server.js`, `package.json`, and `package-lock.json`
- `core/server` for routes, catalogs, auth, and realtime runtime mounting
- `core/player`, `systems`, and `assets` for shared browser/player code
- `gamehub.html`, `documentation.html`, `legal.html`, `gamehub.js`, `gamehub.css`, `game-renderer.html`, `new-game-renderer.html`, `gamehub-socket.js`, and `games-manifest.js`
- `admin.html`, `admin.css`, `admin.js`, `admin-access.js`, `analytics-client.js`, `feedback.css`, and `feedback-widget.js`
- `game-details` for server-side catalog metadata
- `games` with playable HTML entries, media, vendor assets, and built `dist` folders
- `premium` with the premium shell, premium images, built game entries, and mounted runtime server folders
- `.env.example`, `HOSTING.md`, `DEPLOYMENT_CHECKLIST.md`, and `scripts/hosting-audit.js` for deployment safety

Do not deploy local-only material:

- `node_modules` folders
- `.env` files and credential JSON/files
- log files and browser profiles
- local runtime state under premium game server data folders
- local feedback fallback state under `.gamehub-data/`
- local analytics fallback state under `.gamehub-data/`
- local admin audit/manual entitlement fallback state under `.gamehub-data/`
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

Protected admin APIs should reject anonymous requests:

```text
/api/admin/me should return 401
/api/admin/analytics/overview should return 401
/api/admin/analytics/games should return 401
/api/admin/analytics/events should return 401
/api/admin/users/overview should return 401
/api/admin/users should return 401
/api/admin/entitlements should return 401
/api/admin/owned-items should return 401
/api/admin/payments should return 401 without an admin ticket and a disabled/not-connected response for admins
/api/admin/feedback should return 401
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
/.gamehub-data/feedback-reports.json
/.gamehub-data/analytics.json
/.gamehub-data/admin-audit-logs.json
/.gamehub-data/admin-entitlements.json
```
