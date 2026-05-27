# 3D Carrom Royale Online Architecture

Phase 17 prepares the standalone carrom game for future online multiplayer. It does not implement online rooms, matchmaking, server code, Socket.IO wiring, database storage, auth, payments, or external hub integration.

The chosen approach is hybrid server-authoritative multiplayer: clients send shot intent, the server validates and simulates the authoritative shot, clients animate accepted shots for responsiveness, and the server-settled state always wins.

## Current Readiness Audit

### Physics

Current physics lives in `src/physics/`:

- `physics-world.js` owns stepping, fixed timestep accumulation, striker shots, body reset, scenario placement, pocket return placement, snapshots, and mesh sync.
- `physics-body.js` owns body state such as id, type, color, radius, mass, position, velocity, pocket state, sleep state, and reset.
- `collision-resolver.js` handles body/body and rail collision response with no direct Three.js dependency.
- `pocket-detector.js` handles pocket capture and pocket pull.
- `physics-tuning.js` holds most numeric tuning.
- `src/game/shot-resolver.js` turns physics motion and pocket events into settled shot summaries.

Server readiness:

- `collision-resolver.js`, `physics-tuning.js`, and most of `shot-resolver.js` are close to shared-ready.
- `physics-world.js`, `physics-body.js`, and `pocket-detector.js` are not server-ready yet because they still touch mesh visibility, mesh position, mesh rotation, mesh scale, and `mesh.userData`.
- `physics-world.js` also contains client-facing status callbacks, debug correction warnings, and scenario helpers that should be separated from the pure simulation core.
- `getBoardSnapshot()` is a useful starting point for a future network-safe body snapshot.

### Rules And Match State

Current rules and match state live in `src/game/`:

- `rules-engine.js` evaluates Classic and Free Capture rules, including Casual, Standard, Strict, queen cover, fouls, due changes, pieces to return, turn decisions, and messages.
- `match-state-manager.js` creates local matches, applies shot summaries, assigns first-pocket colors, applies rule results, resolves winners, and builds HUD-facing state.
- `score-manager.js`, `queen-manager.js`, `foul-manager.js`, and `turn-manager.js` are mostly data-oriented and good candidates for shared extraction.

Server readiness:

- The rules path is close to Node-ready because it mostly consumes plain match state and shot summaries.
- `match-state-manager.js` mixes core state changes with HUD labels through `toHudMatch()`. Future online work should split pure match state mutation from client presentation.
- Random color assignment and local match ids must be made server-owned in online modes.
- Server snapshots should not include HUD-only text, theme data, cosmetics preview state, or local-only setup panels.

### Client-Only Systems

These should stay client-only:

- `src/scene/`: Three.js scene, camera, board, pieces, materials, markings, aim line, lighting.
- `src/ui/`: overlays, HUD, responsive layout, panels, mode screens.
- `src/input/`: pointer raycasting, striker placement, aiming, release.
- `src/audio/` and `src/vfx/`: local feedback only.
- `src/cosmetics/`: visual loadout and local preview state.
- `src/training/`: onboarding, tutorial, practice, coach hints, localStorage stats.
- `src/challenges/`: solo challenge data, progress, evaluator, and scenario controller.
- `src/bot/`: local bot planning and timers. Bot does not participate in authoritative online matches in the first online phases.
- `src/services/save-settings-manager.js`: local-only settings and player name persistence.

### Browser Dependencies

Current browser-only APIs include:

- `window`, `document`, `localStorage`, keyboard/resize listeners, pointer events, and DOM rendering.
- Three.js meshes, materials, scene graph objects, canvas markings, and renderer lifecycle.
- Client timers for intro, bot, UI, tutorial, and VFX.

The future server must import only shared data and pure logic modules. It must not import scene, UI, input, audio, VFX, cosmetics, training, challenge progress, or localStorage managers.

## Recommended Strategy

Use a hybrid server-authoritative model.

1. Client sends a shot intent only after local input is complete.
2. Server validates room, player, turn, match status, settled bodies, striker placement, direction, power, and duplicate shot id.
3. Server simulates the shot with the shared physics core and applies shared rules.
4. Server broadcasts the accepted shot and the authoritative settled result.
5. Clients animate the accepted shot locally for feel, then reconcile to the authoritative settled snapshot.

This gives the game responsive local feel while keeping turn order, fouls, queen cover, pocketed pieces, scores, and winner detection authoritative.

## Shared Logic Extraction Plan

Future structure:

```text
src/shared/
  constants/
    carrom-constants.js
    physics-tuning.js
    rule-constants.js
  physics/
    physics-body.js
    physics-world-core.js
    collision-resolver-core.js
    pocket-detector-core.js
    shot-resolver-core.js
  game/
    match-state-core.js
    rules-engine-core.js
    turn-manager-core.js
    queen-manager-core.js
    foul-manager-core.js
    scoring-core.js
  net/
    protocol.js
    validators.js
    serializers.js
```

Extraction order:

1. Create a pure body model with id, type, color, radius, mass, position, velocity, pocket state, sleep state, and initial position. Mesh references move to a client adapter.
2. Split physics simulation from visual syncing. The shared core steps bodies and emits events; the client adapter syncs meshes, visibility, scale, spin, and flat-piece visuals.
3. Move pocket detection and collision resolution into shared core modules that work only on body data and pocket data.
4. Split `MatchStateManager` into pure match mutation and client HUD formatting. Keep `toHudMatch()` client-side.
5. Add serializers and validators for match snapshots, shot intent, player state, and authoritative shot results.

Do not move large directories in one pass. The first online implementation should import a small shared core and keep the existing standalone client path stable.

## Future Server Architecture

Suggested files:

```text
server/
  index.js
  socket-server.js
server/carrom/
  carrom-room-manager.js
  carrom-room.js
  carrom-player.js
  carrom-match-engine.js
  carrom-queue-manager.js
  carrom-validators.js
  carrom-serializer.js
  carrom-timers.js
```

Responsibilities:

- `RoomManager`: create private room codes, join rooms, leave rooms, find rooms, clean empty rooms.
- `Room`: hold room code, players, optional spectators later, match config, status, timestamps, and current match state.
- `Player`: bind socket id, player id, display name, seat, ready status, disconnect state, and reconnect token later.
- `MatchEngine`: validate shot intent, run shared physics, apply shared rules, advance turns, and produce authoritative snapshots.
- `QueueManager`: later public matchmaking for Phase 19. It should not be part of the Phase 18 private-room MVP.
- `Validators`: room, player, match config, striker placement, shot direction, shot power, duplicate id, and spam checks.
- `Serializer`: network-safe room state, match snapshot, body snapshot, and result payload conversion.
- `Timers`: later turn timer, disconnect grace timer, rematch timer, and room cleanup timer.

Phase 18 should use in-memory rooms only. No database, account, cloud save, or payment logic is needed for the private-room MVP.

## Future Client Architecture

Suggested files:

```text
src/online/
  online-client.js
  online-room-controller.js
  online-state-sync.js
  online-reconciliation.js
  online-events.js
  online-ui-controller.js
```

Responsibilities:

- `OnlineClient`: connection lifecycle, reconnect attempts, event emit/receive wrappers, and connection status.
- `OnlineRoomController`: create room, join room, leave room, ready state, seat assignment, and lobby state.
- `OnlineStateSync`: apply authoritative match snapshots to local match state and scene bodies.
- `OnlineReconciliation`: compare predicted local body positions with server-settled body positions and lerp or snap safely.
- `OnlineEvents`: central event names and payload helpers shared by UI and controllers.
- `OnlineUIController`: room code UI, lobby, waiting opponent, connection state, opponent left, rematch requests, and reconnect overlays.

The existing local modes should keep their current flow. Online mode should be a separate mode path that reuses shared scene/input rendering but does not trust client-side rule results.

## Socket Event Contracts

All events should use acknowledgement callbacks or explicit error events. Server errors should include `{ code, message, recoverable }`.

### Client To Server

`carrom:createRoom`

- Payload: `{ playerName, matchConfig }`
- Sent by: unauthenticated connected client
- Validate: player name length, allowed rule mode, allowed classic variant, no unsupported online mode flags
- Response: `carrom:roomCreated` or `carrom:error`

`carrom:joinRoom`

- Payload: `{ roomCode, playerName, reconnectToken? }`
- Sent by: connected client
- Validate: room exists, room has seat or reconnect token matches, player name length
- Response: `carrom:roomJoined`, `carrom:roomState`, or `carrom:error`

`carrom:leaveRoom`

- Payload: `{ roomCode }`
- Sent by: seated player
- Validate: socket belongs to room
- Response: `carrom:playerLeft`, updated `carrom:roomState`

`carrom:setPlayerName`

- Payload: `{ roomCode, playerName }`
- Sent by: seated player
- Validate: socket belongs to room, safe display length
- Response: updated `carrom:roomState`

`carrom:updateMatchConfig`

- Payload: `{ roomCode, matchConfig }`
- Sent by: room host before match start
- Validate: host seat, lobby status, supported config values
- Response: updated `carrom:roomState` or `carrom:shotRejected` style config error

`carrom:ready`

- Payload: `{ roomCode, ready }`
- Sent by: seated player
- Validate: socket belongs to room, lobby status
- Response: updated `carrom:roomState`

`carrom:startMatch`

- Payload: `{ roomCode }`
- Sent by: host
- Validate: room has two players, both ready, status is lobby
- Response: `carrom:matchStarted`, initial `carrom:matchState`

`carrom:submitShot`

- Payload: shot intent contract defined below
- Sent by: current player
- Validate: full shot validation
- Response: `carrom:shotAccepted` or `carrom:shotRejected`

`carrom:requestRematch`

- Payload: `{ roomCode, matchId }`
- Sent by: seated player after finish
- Validate: room and match id, finished status
- Response: `carrom:rematchRequested`

`carrom:respondRematch`

- Payload: `{ roomCode, matchId, accepted }`
- Sent by: seated player
- Validate: pending rematch request exists
- Response: `carrom:rematchStarted` or updated `carrom:roomState`

`carrom:joinPublicQueue`

- Payload: `{ playerName, matchConfig }`
- Sent by: connected client in Phase 19
- Validate: supported public config
- Response: `carrom:queueStatus`

`carrom:cancelPublicQueue`

- Payload: `{}`
- Sent by: queued client in Phase 19
- Validate: socket is queued
- Response: `carrom:queueStatus`

`carrom:ping`

- Payload: `{ clientTime }`
- Sent by: any connected client
- Validate: none beyond rate limits
- Response: `carrom:connectionStatus`

### Server To Client

`carrom:roomCreated`

- Payload: `{ roomCode, playerId, seat, roomState }`
- Sent to: creator
- Purpose: confirm private room creation

`carrom:roomJoined`

- Payload: `{ roomCode, playerId, seat, reconnectToken?, roomState }`
- Sent to: joining player
- Purpose: confirm seat and local identity

`carrom:roomState`

- Payload: room snapshot with players, config, ready states, status, host, and timestamps
- Sent to: all room clients
- Purpose: lobby and room sync

`carrom:playerJoined`

- Payload: `{ roomCode, player }`
- Sent to: room
- Purpose: lightweight join notification

`carrom:playerLeft`

- Payload: `{ roomCode, playerId, reason }`
- Sent to: room
- Purpose: leave/disconnect notification

`carrom:matchStarted`

- Payload: initial match snapshot
- Sent to: room
- Purpose: transition lobby to online match

`carrom:shotAccepted`

- Payload: `{ roomCode, matchId, shotId, clientShotId, serverTime }`
- Sent to: shooter
- Purpose: allow local predicted animation to begin

`carrom:shotRejected`

- Payload: `{ roomCode, matchId, clientShotId, code, message }`
- Sent to: shooter
- Purpose: unlock input and explain rejection

`carrom:shotStarted`

- Payload: `{ roomCode, matchId, shotId, playerId, strikerPosition, direction, power, serverTime }`
- Sent to: opponent and optionally shooter
- Purpose: animate the authoritative shot intent

`carrom:shotSettled`

- Payload: settled shot contract defined below
- Sent to: room
- Purpose: reconcile final body state and rules

`carrom:matchState`

- Payload: match snapshot
- Sent to: room
- Purpose: authoritative state sync

`carrom:turnChanged`

- Payload: `{ roomCode, matchId, currentPlayerId, turnNumber, shotNumber }`
- Sent to: room
- Purpose: compact turn update

`carrom:foul`

- Payload: `{ roomCode, matchId, playerId, foulType, messages, returnedPieces }`
- Sent to: room
- Purpose: show foul feedback

`carrom:queenState`

- Payload: `{ roomCode, matchId, queen }`
- Sent to: room
- Purpose: show queen pending, covered, returned, or on-board state

`carrom:matchFinished`

- Payload: `{ roomCode, matchId, winnerPlayerId, draw, resultSummary, matchState }`
- Sent to: room
- Purpose: show result screen

`carrom:rematchRequested`

- Payload: `{ roomCode, matchId, requestedByPlayerId }`
- Sent to: opponent
- Purpose: rematch prompt

`carrom:rematchStarted`

- Payload: new initial match snapshot
- Sent to: room
- Purpose: reset online match safely

`carrom:queueStatus`

- Payload: `{ status, estimatedWaitMs?, message }`
- Sent to: queued client in Phase 19
- Purpose: matchmaking feedback

`carrom:matchFound`

- Payload: `{ roomCode, roomState }`
- Sent to: matched players in Phase 19
- Purpose: enter public match room

`carrom:error`

- Payload: `{ code, message, recoverable }`
- Sent to: affected client
- Purpose: generic recoverable or fatal error feedback

`carrom:connectionStatus`

- Payload: `{ serverTime, latencyMs?, status }`
- Sent to: client
- Purpose: connection health and clock approximation

## Shot Payload Contract

Client submit payload:

```json
{
  "roomCode": "ABCD",
  "matchId": "match_123",
  "playerId": "player-1",
  "clientShotId": "client-shot-001",
  "strikerPosition": { "x": 0.2, "z": 1.68 },
  "direction": { "x": -0.14, "z": -0.99 },
  "power": 7.4,
  "ruleMode": "classic",
  "timestamp": 1790000000000
}
```

Server validation:

- Room exists and contains the socket.
- Match id matches the room match.
- Player id belongs to the socket.
- Player is the current turn.
- Match status is `playing`.
- No pieces are moving.
- Striker placement is legal for the active player's baseline.
- Striker does not overlap active pieces.
- Direction is finite, normalized or normalizable, and not zero-length.
- Power is finite and within server constants.
- Timestamp is not too stale.
- `clientShotId` has not already been accepted or rejected for this match/player.
- Client rule mode matches server match config.

Server accepted payload:

```json
{
  "roomCode": "ABCD",
  "matchId": "match_123",
  "shotId": "server-shot-999",
  "clientShotId": "client-shot-001",
  "serverTime": 1790000000100
}
```

Server settled payload:

```json
{
  "roomCode": "ABCD",
  "matchId": "match_123",
  "shotId": "server-shot-999",
  "finalBodies": [
    {
      "id": "striker-1",
      "type": "striker",
      "color": "ivory",
      "x": 0.0,
      "z": 1.68,
      "vx": 0,
      "vz": 0,
      "isPocketed": false
    }
  ],
  "pocketedPieces": [],
  "ruleResult": {
    "ruleMode": "classic",
    "classicRuleVariant": "casual",
    "isFoul": false,
    "foulType": "",
    "queenCovered": false,
    "queenReturned": false,
    "queenPending": false,
    "shouldSwitchTurn": true,
    "shouldContinueTurn": false,
    "messages": ["No coin pocketed. Turn switched."]
  },
  "matchState": {},
  "nextPlayerId": "player-2",
  "serverTime": 1790000002500
}
```

The client may animate before the settled payload arrives, but must reconcile to `finalBodies` and `matchState`.

## Match Snapshot Format

Network-safe match snapshot:

```json
{
  "matchId": "match_123",
  "roomCode": "ABCD",
  "mode": "onlinePrivate",
  "ruleMode": "classic",
  "classicRuleVariant": "casual",
  "players": [
    {
      "id": "player-1",
      "name": "Player 1",
      "seat": 1,
      "color": "white",
      "connected": true,
      "ready": true,
      "score": 0,
      "pocketedOwnCoinIds": [],
      "capturedCoinIds": [],
      "dueCount": 0,
      "returnedPenaltyCount": 0
    }
  ],
  "currentPlayerId": "player-1",
  "turnNumber": 1,
  "shotNumber": 0,
  "queen": {
    "state": "onBoard",
    "pocketedByPlayerId": null,
    "pendingCoverPlayerId": null,
    "pendingCoverShotNumber": null
  },
  "pocketedPieces": {
    "white": [],
    "black": [],
    "queen": false
  },
  "lastFoul": "",
  "pieces": [
    {
      "id": "inner-white-coin-1",
      "type": "coin",
      "color": "white",
      "x": 0,
      "z": 0,
      "vx": 0,
      "vz": 0,
      "isPocketed": false
    }
  ],
  "status": "playing",
  "winnerPlayerId": null,
  "draw": false,
  "updatedAt": 1790000000000,
  "serverTime": 1790000000000
}
```

Never send Three.js meshes, DOM elements, material tokens, cosmetics preview state, localStorage values, local HUD-only text, local debug state, or browser-only references.

## Validation And Anti-Cheat Plan

Server rejects:

- Shot from wrong player or wrong socket.
- Shot while pieces are moving.
- Shot after match finished or before match started.
- Invalid room, match, player, or seat.
- Illegal striker placement for the current baseline.
- Striker overlap with active pieces.
- Impossible or non-finite power.
- Invalid, non-finite, or zero-length direction.
- Duplicate `clientShotId`.
- Stale timestamp beyond allowed tolerance.
- Suspicious rapid event spam.
- Client config mismatch with server match config.

Server never accepts:

- Client-declared score.
- Client-declared winner.
- Client-declared pocketed pieces.
- Client-declared queen cover.
- Client-declared foul result.
- Client-declared turn switch.
- Client-declared final body state.

The client can predict visuals, but server final state is authoritative.

## Latency And Reconciliation Plan

Recommended online feel:

1. Local player submits shot intent.
2. Server returns `shotAccepted`.
3. Local player begins predicted animation from the accepted intent.
4. Opponent receives `shotStarted` and animates the same intent.
5. Server simulates and broadcasts `shotSettled`.
6. Clients compare local predicted bodies with authoritative final bodies.
7. If positions are close, lerp pieces into place during the settle pause.
8. If positions are far, hard reconcile after a short fade or settle pause.
9. Show a compact "Syncing..." state only when mismatch is visible.

Do not block the whole UI during normal latency. Only lock shot input while a shot is pending, moving, or reconciling.

## Roadmap

### Phase 18: Private Rooms MVP

- Add Socket.IO server and minimal client connection.
- Create room, join room, leave room.
- Lobby with room code and ready state.
- Start online private match.
- Submit validated shot intent.
- Server applies authoritative physics/rules result.
- Broadcast settled snapshot.
- Basic opponent-left handling.

### Phase 19: Public Matchmaking

- Add public queue.
- Match two real players by compatible config.
- Cancel queue.
- Match found event and room handoff.
- Optional bot fill can be evaluated later, but not required for v1.

### Phase 20: Reconnect, Rematch, And Timers

- Reconnect using session/reconnect token.
- Opponent disconnected state.
- Disconnect grace timer.
- Rematch request and response.
- Turn timer.
- Room cleanup timer.

### Phase 21: Online Hardening

- Anti-cheat edge cases.
- Validation fuzzing.
- Latency smoothing.
- Stress testing.
- Mobile online QA.
- Room lifecycle and memory cleanup.

## Risks And Open Questions

- The physics core must be separated from mesh sync before true server simulation is safe.
- Determinism should be tested once shared physics exists. The server result wins, so exact client/server determinism is helpful but not mandatory for fairness.
- Returned-piece placement must be server-owned so penalty and queen returns cannot diverge.
- Open/First Pocket and Strict due behavior need explicit online tests because they change player state after a shot settles.
- Cosmetics should remain local visual state only and should not affect online physics or validation.
- Challenge, tutorial, and practice modes should remain solo and should not route through online match state.

## Phase 17 Completion Notes

Phase 17 intentionally adds no server implementation, online client runtime, dependencies, database, auth, payment, matchmaking, or deployment code. The next implementation phase should start with the shared physics/rules extraction required for a server-owned `MatchEngine`, then add the Private Rooms MVP.
