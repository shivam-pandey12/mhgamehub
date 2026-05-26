# Chess Rules QA

## Scope

Audited the premium 3D Chess runtime at `premium/premium-games/chess-codex`.

Primary rule source of truth:
- `chess.js` is used for legal moves, check, checkmate, stalemate, castling, en passant, promotion, SAN, draw detection, FEN, and move history.

Rule-related files inspected:
- `premium/premium-games/chess-codex/src/chess3d-app.js`
- `premium/premium-games/chess-codex/src/services/stockfish-service.js`
- `premium/premium-games/chess-codex/server/index.js`
- `premium/premium-games/chess-codex/server/botPlayer.js`
- `premium/premium-games/chess-codex/server/publicRoomManager.js`
- `premium/premium-games/chess-codex/src/match-storage.js`

## What Was Tested

- Basic legal and illegal movement for pawns, knights, bishops, rooks, queen, and king.
- Own-piece capture rejection and opponent-piece turn rejection.
- Check escape, pinned-piece legality, double-check behavior, checkmate, stalemate, and no moves after game over.
- Kingside and queenside castling for both colors.
- Illegal castling through check, while in check, and after rook movement.
- En passant capture, captured pawn removal, immediate-only availability, and expiry.
- Promotion to queen, rook, bishop, and knight.
- SAN for checkmate, castling, and promotion.
- Replay from recorded moves ending in the same FEN.
- Insufficient material, fifty-move draw, threefold repetition, and stalemate via chess.js.
- Server bot move selection returns only legal moves.
- Online room validation rejects spectators, wrong-turn moves, and illegal moves server-side before state mutation.
- Online room accepts a legal move after prior illegal requests, proving room state remains valid.

## Passed

- Frontend legal move selection is based on `this.chess.moves({ square, verbose: true })`.
- All local, AI, replay, puzzle, and online-applied moves go through `executeMove()`, which now catches chess.js illegal-move throws.
- Online multiplayer validates moves server-side with its own authoritative `Chess` instance.
- Online server enforces seated player, turn order, connected players, room start state, and pending agreement blocks.
- Bot-fill online mode chooses from `chess.moves({ verbose: true })` and is then validated again by server chess.js.
- Stockfish moves are converted from UCI and still pass through client chess.js before being applied.
- Saved matches include FEN, move list, turn, clocks, last move, draw state, and variant state.
- Restored matches replay moves first and fall back to saved FEN if replay fails.

## Failed And Fixed

- Critical: `chess.js` throws on invalid move input, but the client and server expected a falsy return. Illegal crafted moves could crash or break sync instead of cleanly rejecting.
  - Fixed by adding `tryChessMove()` wrappers in client and server move paths.

- Critical: Online timers were client-side only. A tampered or stale client could try to keep moving after local timeout.
  - Fixed by adding authoritative room clocks on the server, server timeout game-over state, and clock snapshots in online payloads.

- Major: Client `executeMove()` mutated chess.js before confirming the matching visual piece existed.
  - Fixed by checking `piecesBySquare` before applying the chess.js move.

- Major: Online undo could be requested after a finished game.
  - Fixed by rejecting undo requests once `isRoomFinished(room)` is true.

- Minor: Online game-over payloads did not always include clock data.
  - Fixed by including serialized clocks in timeout, draw, and abandoned game-over payloads.

## Remaining Notes

- Draw offer by agreement is implemented.
- Stalemate, insufficient material, fifty-move, and threefold repetition are supported through chess.js draw detection.
- Server game summaries currently report automatic draw as `result: "draw"`; the client can derive more specific draw text from chess.js locally. No server API currently labels every automatic draw subtype.
- Public matchmaking reconnect currently rejects public match restoration after reload; private room reconnect is implemented. This is a product limitation, not a chess legality bypass.
- No custom chess engine was added.

## Commands

Run syntax checks:

```powershell
node --check premium\premium-games\chess-codex\src\chess3d-app.js
node --check premium\premium-games\chess-codex\server\index.js
node --check premium\premium-games\chess-codex\server\botPlayer.js
node --check premium\premium-games\chess-codex\server\publicRoomManager.js
node --check premium\premium-games\chess-codex\src\services\stockfish-service.js
```

Run automated chess QA:

```powershell
npm test --prefix premium\premium-games\chess-codex
```

Run production build:

```powershell
npm run build --prefix premium\premium-games\chess-codex
```

## Latest Verification

Last run in this workspace:

- Passed: `node --check premium\premium-games\chess-codex\src\chess3d-app.js`
- Passed: `node --check premium\premium-games\chess-codex\server\index.js`
- Passed: `node --check premium\premium-games\chess-codex\server\botPlayer.js`
- Passed: `node --check premium\premium-games\chess-codex\server\publicRoomManager.js`
- Passed: `node --check premium\premium-games\chess-codex\src\services\stockfish-service.js`
- Passed: `npm test --prefix premium\premium-games\chess-codex`
- Passed: `npm run build --prefix premium\premium-games\chess-codex`
