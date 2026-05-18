# 3D Snake & Ladder Royale

A premium Ivory Royale Three.js board game for GameHub. The game supports local play, local bots, private online rooms, public matchmaking, server-side bot fill, rematch, reconnect grace, and cinematic VS intros.

No Firebase, no database, no persistent accounts. Online rooms, queues, reconnect tokens, bot timers, and matches live only in server memory.

## Run Locally

Install dependencies:

```bash
npm install
```

Client only:

```bash
npm run dev
```

Real-time server only:

```bash
npm run dev:server
```

Client and server together:

```bash
npm run dev:full
```

Production build:

```bash
npm run build
npm start
```

Local Play works without the online server. Private Room and Public Match require the Socket.IO server.

## Environment

Client:

- `VITE_SOCKET_URL`: optional Socket.IO server URL. If missing, the client uses same-origin and shows online unavailable if it cannot connect.
- `VITE_GAMEHUB_HOME_URL`: optional route used by Main Menu when embedded in GameHub.

Server:

- `PORT`: default `3000`
- `CORS_ORIGIN`: default `*`
- `LOG_LEVEL`: `silent`, `error`, `warn`, `info`, or `debug`
- `DISCONNECT_GRACE_MS`: reconnect grace window
- `ROOM_IDLE_MS`: inactive room expiry
- `FINISHED_ROOM_TTL_MS`: finished match expiry
- `PUBLIC_BOT_FILL_MS`: public queue bot-fill wait
- `PUBLIC_QUEUE_TICK_MS`: queue processing interval
- `CLEANUP_INTERVAL_MS`: memory cleanup interval
- `PUBLIC_STILL_SEARCHING_MS` / `PUBLIC_BOT_FILL_SOON_MS`: queue status timing
- `PUBLIC_START_DELAY_MS` / `INTRO_LOCK_MS`: public countdown and local client intro lock timing
- `RATE_LIMIT_TTL_MS`: stale rate-limit cleanup window

## Health

- `GET /health`: basic health, room count, queue count, uptime
- `GET /status`: safe launch status with active room and queue counts

## Online Memory Model

All online data is in memory. If the server restarts, active rooms and queues expire. Reconnect only works while the same server process still has the room and session token.

Public matchmaking uses a single queue processor with entry states to avoid duplicate bot-filled rooms. Server-side bots are authoritative and use the same dice and movement resolver as real players.

## QA

```bash
npm run smoke:phase5
npm run smoke:phase6
npm run smoke:phase7
npm run build
```

Development-only debug overlay: press `Ctrl + Shift + D` in a Vite dev build. Debug and QA helpers are not enabled in production by default.

## Launch Checklist

- Local Play opens and works with the server stopped.
- Private Room and Public Match show `Online server unavailable` when `VITE_SOCKET_URL` is missing or unreachable.
- Server restart behavior is understood: all rooms, queues, reconnect tokens, and rematch votes are cleared because there is no database.
- Public bot-fill timing is configured with `PUBLIC_BOT_FILL_MS` and verified with `npm run smoke:phase7`.
- `/health` and `/status` are reachable from the deployed server.
- Run `npm run smoke:phase5`, `npm run smoke:phase6`, `npm run smoke:phase7`, and `npm run build` before adding the game to GameHub.

## Troubleshooting

- Online server unavailable: start `npm run dev:server`, check `VITE_SOCKET_URL`, then use Retry Online Connection.
- Room expired: the in-memory server room was cleaned up or the server restarted.
- WebGL unavailable: use a modern browser with hardware acceleration enabled.
- Mobile performance: use the Quality setting and choose Low or Auto.
