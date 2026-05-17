# MH Handrex

MH Handrex is a realtime multiplayer hand cricket game built with:

- Frontend: vanilla HTML, CSS, and ES modules
- Backend: Node.js, Express, and Socket.io
- State model: deterministic local store plus server-authoritative match sync

The project is designed to feel production-structured without needing a frontend framework or database.

## What It Does

- Create and join realtime rooms with shareable invite links
- Play configurable matches from `1v1` up to `11v11`
- Assign host and captains
- Run toss, lineup setup, and live gameplay
- Sync ball inputs through the backend so both numbers reveal together
- Support reconnect and refresh recovery during an active match
- Save last match summary and history locally in the browser

## Current Architecture

The app is split into three layers:

1. UI layer
   - Screens and reusable components render the app shell and match flow.
2. Service layer
   - `roomService` and `matchService` translate UI actions into socket events and store updates.
3. Engine/store layer
   - The frontend engine keeps deterministic match behavior for local state transitions and UI rendering.
   - The backend is the source of truth for live multiplayer events.

## Project Structure

```text
.
|-- index.html
|-- favicon.png
|-- src
|   |-- app
|   |   |-- app.js
|   |   |-- router.js
|   |   `-- screenRegistry.js
|   |-- components
|   |   |-- ballTimeline.js
|   |   |-- button.js
|   |   |-- card.js
|   |   |-- lineupEditor.js
|   |   |-- numberPad.js
|   |   |-- playerList.js
|   |   |-- playerTile.js
|   |   |-- scoreboard.js
|   |   |-- shell.js
|   |   |-- statusPill.js
|   |   `-- toast.js
|   |-- config
|   |   `-- constants.js
|   |-- engine
|   |   |-- gameEngine.js
|   |   |-- rules.js
|   |   `-- validators.js
|   |-- screens
|   |   |-- historyScreen.js
|   |   |-- homeScreen.js
|   |   |-- lineupScreen.js
|   |   |-- lobbyScreen.js
|   |   |-- matchScreen.js
|   |   |-- resultScreen.js
|   |   |-- roomScreen.js
|   |   |-- rulesScreen.js
|   |   `-- tossScreen.js
|   |-- services
|   |   |-- matchService.js
|   |   |-- mockSocket.js
|   |   |-- roomService.js
|   |   `-- simulationService.js
|   |-- state
|   |   |-- actions.js
|   |   |-- initialState.js
|   |   |-- selectors.js
|   |   `-- store.js
|   |-- styles
|   |   |-- animations.css
|   |   |-- base.css
|   |   |-- components.css
|   |   |-- layout.css
|   |   |-- main.css
|   |   |-- screens.css
|   |   `-- tokens.css
|   |-- types
|   |   `-- models.d.ts
|   `-- utils
|       |-- formatters.js
|       |-- helpers.js
|       |-- id.js
|       `-- storage.js
`-- backend
    |-- server.js
    |-- models
    |   |-- gameStore.js
    |   `-- roomStore.js
    |-- sockets
    |   |-- gameHandler.js
    |   `-- roomHandler.js
    `-- utils
        `-- idGenerator.js
```

## Frontend Flow

### Home

- Enter player name
- Enter or paste room code
- Choose players per team from `1 vs 1` up to `11 vs 11`
- Create room, join room, quick match, or open rules

### Room

- See live player presence
- Copy invite link
- Host can remove players
- Room fills until `playersPerTeam * 2`

### Lobby

- Host configures:
  - match mode: `single` or `two-batsmen`
  - bowling mode: `free-change` or `over-locked`
  - overs
- Players toggle ready
- Host starts toss when room is full and everyone is ready

### Toss

- Alpha captain calls heads or tails
- Winning captain chooses bat or bowl
- Toss result is broadcast to everyone

### Lineup

- Captains arrange batting and bowling order
- Host starts the match after toss and lineup are complete

### Match

- Active batter and bowler each send a number from the room's active number set
- Server waits for both selections
- Server computes the ball result
- Both clients reveal the result together
- Match continues through overs, wickets, innings switch, and chase

### Result

- Winner
- Final innings summary
- Basic stats
- Ball history
- Rematch or back home

## Core Gameplay Rules

Each legal ball:

- Batter chooses a number from `1` to `6`
- Bowler chooses a number from `1` to `6`
- If both numbers match: batter is out
- If numbers do not match: runs equal the batter number

Match behavior:

- `single` mode uses one batter at a time
- `two-batsmen` mode tracks striker and non-striker
- Odd runs rotate strike in two-batsmen mode
- Strike also changes at the end of the over
- Over length is always `6` legal balls
- Second innings target is first innings score plus one
- Match ends on:
  - all out
  - overs completed
  - target achieved

## Backend Realtime Model

The backend is fully in-memory right now.

### Room State

Each room stores:

- `roomId`
- `hostId`
- `status`
- `teamSize`
- `maxPlayers`
- `settings`
- `captains`
- `tossResult`
- `players`

### Game State

Each live game stores:

- `roomId`
- `status`
- `settings`
- `teams`
- `innings`
- `currentInningsIndex`
- `playerInputs`
- `ballHistory`
- `result`

## Socket Events

### Room Events

- `create_room`
  - client -> server
  - payload: `playerName`, `playerKey`, `teamSize`, `settings`
- `join_room`
  - client -> server
  - payload: `roomId`, `playerName`, `playerKey`
- `resume_session`
  - client -> server
  - payload: `roomId`, `playerKey`, `playerName`
- `leave_room`
  - client -> server
- `update_room_config`
  - client -> server
  - payload: `settings` and/or `captains`
- `kick_player`
  - client -> server
  - payload: `playerId`
- `room_created`
  - server -> creator
- `room_update`
  - server -> entire room
- `room_error`
  - server -> requesting socket
- `room_kicked`
  - server -> removed or replaced socket

### Toss Events

- `start_toss`
- `run_toss`
- `choose_toss`

### Match Events

- `start_match`
  - payload includes batting-first info, settings, and finalized teams
- `select_number`
  - payload: `number`
- `game_started`
  - server snapshot of the live match
- `next_turn`
  - server snapshot of the active turn
- `ball_result`
  - server reveal payload for the resolved delivery
- `match_end`
  - final result or abort payload
- `game_error`
  - validation or flow errors
- `player_left`
  - broadcast when a player leaves or times out

## Refresh And Rejoin Support

The app now supports recovery after refresh or accidental tab close.

How it works:

- A persistent `playerKey` is stored in local storage
- The active room code is stored in session data
- On reconnect, the frontend automatically sends `resume_session`
- The backend rebinds the player from the old socket id to the new socket id
- If the match is still live, the backend sends the latest room and game snapshot

Notes:

- A disconnected player gets a grace window before being removed from the room
- If the player does not return before the timeout, the room removes them
- If a live match is active and a player never returns, the match is aborted

## Local Storage

Browser storage is intentionally simple.

Stored keys:

- `mh-handrex-session`
  - player identity, profile name, last room code, active room code
- `mh-handrex-history`
  - recent local match history
- `mh-handrex-state`
  - last saved result summary

Used by:

- auto-fill recent room code
- restore saved player identity
- resume active room session after refresh
- show recent match summary on the home screen

## How To Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the game

```bash
npm start
```

The standalone game runs at:

```text
http://localhost:4000
```

Health endpoint:

```text
http://localhost:4000/health
```

### 3. Test realtime play

Open two or more browser windows:

1. Create a room in one window
2. Join the room from another window or device
3. Ready up all players
4. Start toss
5. Finalize lineups
6. Start the match

## Invite Links

When a room exists, the room screen can generate a shareable link like:

```text
http://localhost:4000/?room=ABC123
```

Opening that link pre-fills the room code on the home screen.

## Important Files

### Frontend

- [index.html](./index.html)
  - root HTML shell
- [src/main.js](./src/main.js)
  - bootstraps store, socket, services, and app
- [src/services/mockSocket.js](./src/services/mockSocket.js)
  - realtime socket wrapper
  - despite the legacy file name, it now loads the real Socket.io browser client
- [src/services/roomService.js](./src/services/roomService.js)
  - room creation, join, invite, captain, ready, and resume flow
- [src/services/matchService.js](./src/services/matchService.js)
  - toss, live match events, reveal timing, pause, reconnect, and result routing
- [src/engine/gameEngine.js](./src/engine/gameEngine.js)
  - deterministic frontend match logic used to keep UI state predictable

### Backend

- [backend/server.js](./backend/server.js)
  - Express and Socket.io entrypoint
- [backend/models/roomStore.js](./backend/models/roomStore.js)
  - in-memory room storage and reconnect tracking
- [backend/models/gameStore.js](./backend/models/gameStore.js)
  - in-memory live match state and ball resolution
- [backend/sockets/roomHandler.js](./backend/sockets/roomHandler.js)
  - room lifecycle and reconnect behavior
- [backend/sockets/gameHandler.js](./backend/sockets/gameHandler.js)
  - ready state, match start, number selection, next turn, and match end

## Development Notes

- The frontend keeps a legacy file name `mockSocket.js`, but it is now a real Socket.io transport wrapper.
- `simulationService.js` remains in the codebase as leftover frontend simulation support and can be removed later if not needed.
- The backend is intentionally database-free for now.
- Room and game state reset when the backend restarts.

## Known Limitations

- Backend storage is in-memory only
- No authentication or user accounts yet
- No persistent match database yet
- No spectator mode yet
- The reconnect model restores a player session by `playerKey`, so the same browser session should not intentionally play as two separate users in the same room

## Suggested Next Steps

- Persist rooms and results to a database
- Add authenticated player profiles
- Add server-side validation for captain-only lineup edits during the live match
- Remove old simulation-only leftovers once the realtime stack is fully finalized
- Add automated tests for room resume, toss flow, and ball resolution
