# Production Checklist

## Required

1. Build the client:
   `npm run build`
2. Start the multiplayer server:
   `npm run start:server`
3. Serve `dist/` from your static host or CDN.

## Server Auth

The multiplayer server now expects verified Firebase identities in production.
When Firebase Admin is configured, multiplayer profiles, live rooms, ready states,
quick-match queue entries, reconnect windows, and recent room history are stored
in Firestore instead of the old local JSON file.

Set one of:

- `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json`
- `FIREBASE_SERVICE_ACCOUNT_JSON={...full service account json...}`

Set:

- `NODE_ENV=production`
- `ALLOW_INSECURE_LOCAL_AUTH=false`
- `MULTIPLAYER_ALLOWED_ORIGINS=https://your-game.example.com`

Without Firebase Admin credentials, the server will reject production multiplayer auth.

## Notes

- `vite preview` is only a preview server, not your real production static host.
- The multiplayer server exposes `/health` with auth mode, active state-store mode,
  and queue/room counts.
- For local development, insecure socket auth fallback stays available unless you explicitly disable it.
- Make sure Firestore is enabled in the Firebase project used by the server.
