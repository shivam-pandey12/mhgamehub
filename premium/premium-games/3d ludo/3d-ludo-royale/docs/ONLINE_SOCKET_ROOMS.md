# 3D Ludo Royale Online Rooms

Phase 7 online play uses Node.js, Express, Socket.IO, and in-memory state only.
It supports private room codes, public matchmaking queues, optional public queue bot fill, and memory-only online rematches.
There is no database, Firebase, login, chat, payment flow, leaderboard, or persistent profile data.

## Run Locally

```bash
npm install
npm run dev:all
```

Or run separately:

```bash
npm run server
npm run dev
```

The default server is `http://localhost:3001`.
The default Vite client is `http://localhost:5173`.

Smoke test:

```bash
npm run smoke
```

The smoke script starts a temporary Socket.IO server, creates a private room, matches two public queue clients, then shuts down.

## Environment

Copy `.env.example` if you need custom ports:

```bash
VITE_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

No database variables are required.

Health check:

```bash
GET http://localhost:3001/health
```

The health response returns `ok`, uptime, active room/queue counts, connected sockets, countdown timers, bot timers, and service/version labels only.

## How Rooms Work

- A player creates a short room code such as `LUDO-7KQ2`.
- Other players join by code during the lobby phase.
- The host selects 2, 3, or 4 players and starts when seats are filled and non-hosts are ready.
- The server owns dice rolls, legal move validation, capture, home, exact finish, and winner state.
- Clients only submit roll/move intent and animate server actions locally.
- Reconnect works only while the same server process still has the room in memory.

## How Public Matchmaking Works

- A player chooses Public Matchmaking and clicks Find Match.
- The server places the guest session in a memory-only queue by requested player count.
- A session can only have one active queue entry.
- When enough compatible players are searching, the server creates a public room and assigns seats.
- A 5-second match-found countdown is broadcast to all matched players.
- The server starts the public match automatically after countdown.
- Public matches use the same authoritative dice and token-move pipeline as private rooms.
- If someone disconnects during countdown, the countdown room is cancelled and remaining connected players return to search.
- Bot fill can be `off`, `after-wait`, or `immediate`.
- `after-wait` is the default and fills missing public seats after about 30 seconds.
- Bot-filled public seats are server-only players. Clients never run public bot actions.

## Rematch

- Online rematch votes are stored in memory on the room.
- Private rooms preserve the same seats/colors when all connected humans vote for rematch.
- Public rooms preserve the same seats/colors; server bots auto-accept.
- Rematch voting expires after about 30 seconds.
- Rematch reset clears dice, winner, action log, stale game state, and rematch votes while keeping the room and seats.

## Accepted Limitations

- Server restart clears all rooms.
- Server restart clears all public matchmaking queues.
- Bot fill is public-matchmaking only in Phase 7; private room bot fill is still deferred.
- No accounts, chat, leaderboard, public rankings, or persistent stats.
- Reconnect and rematch only work while the same single Node process still has room memory.

## Two-Browser QA

1. Run `npm run dev:all`.
2. Open `http://localhost:5173` in two browser windows.
3. Window one: choose Online Private Room, enter a name, create a room.
4. Window two: choose Online Private Room, enter the room code, join, and ready.
5. Host starts the match.
6. Verify dice, token movement, capture, safe cells, home lane, winner modal, rematch vote, refresh, leave, and rapid-click protections.

## Public Matchmaking QA

1. Run `npm run dev:all`.
2. Open `http://localhost:5173` in two browser windows.
3. In both windows, choose Public Matchmaking, enter names, and click Find Match.
4. Verify the searching panel, bot-fill status, match-found countdown, automatic start, dice sync, token movement sync, winner flow, Rematch Same Players, and Find Another Match path.
5. Repeat with 3-player and 4-player searches if you have enough windows.
6. Test Cancel Search, refresh while searching, refresh during countdown, and disconnect during countdown.
7. Test Bot Fill Off, After Wait, and Immediate. Bot-filled public matches should complete with server-side bot turns.
