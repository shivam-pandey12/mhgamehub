# Online QA Checklist

Phase 21 hardening keeps online play memory-only and server-authoritative. Use two browser tabs with `npm run server` and `npm run dev` running in separate terminals.

## Private Rooms

1. Create a private room in Tab 1.
2. Join from Tab 2 with the room code.
3. Confirm both names appear in lobby.
4. Confirm only host can start.
5. Start match and confirm both boards load the same state.
6. Confirm only the current player can aim.
7. Try a wrong-turn shot and confirm it is rejected cleanly.
8. Try rapid shot submit spam and confirm rate-limit or duplicate-shot rejection.
9. Take valid shots from both tabs and confirm turns, scores, fouls, queen state, and winner state sync.

## Public Matchmaking

1. Queue Tab 1 with Classic / Casual / Random.
2. Confirm wait timer and queue status.
3. Cancel once and confirm the queue exits cleanly.
4. Queue Tab 1 again.
5. Queue Tab 2 with compatible preferences.
6. Confirm both receive match found and enter the public match automatically.
7. Confirm public match uses the same shot validation and sync behavior as private rooms.
8. Confirm a queued player cannot create or join a private room without leaving queue state.

## Reconnect

1. Start an online match.
2. Refresh the current player tab.
3. Use the reconnect prompt.
4. Confirm room, turn, timer, pieces, queen, score, and result state restore.
5. Refresh the opponent tab and repeat.
6. Try reconnect after the room closes and confirm the saved session clears.

## Disconnect Grace

1. Close one tab during a match.
2. Confirm the other tab shows opponent disconnected and a countdown.
3. Reopen before expiry and reconnect.
4. Confirm disconnect grace clears and the turn timer resumes.
5. Repeat and let grace expire.
6. Confirm room closed state is clear and input remains locked.

## Turn Timer

1. Start an online match and do not shoot.
2. Confirm timer counts down from the server state.
3. Confirm low-time warning appears under 10 seconds.
4. Confirm timeout switches turn once.
5. Confirm timer resets after a valid shot settles.
6. Confirm timer pauses during disconnect grace and does not duplicate after reconnect.

## Rematch

1. Finish an online match.
2. Request rematch from one tab.
3. Confirm opponent sees a rematch request.
4. Accept from the second tab.
5. Confirm a new match ID, reset board, reset queen, reset scores, and fresh timer.
6. Repeat and decline once.
7. Confirm decline clears rematch state and does not start a ghost rematch.

## Invalid Shot And Rate Limits

1. Try submitting a shot while pieces are moving.
2. Try submitting the same shot ID twice through debug/manual dev tooling if available.
3. Try invalid power, invalid direction, missing room, and stale match ID through manual socket tooling if available.
4. Confirm the server rejects with clear reason codes and does not crash.
5. Confirm valid shots still work after rejected attempts.

## Mobile Online

1. Open private room flow in portrait.
2. Open public matchmaking in portrait.
3. Confirm forms and status panels scroll without horizontal overflow.
4. Rotate to landscape and play a valid online shot.
5. Confirm turn timer, reconnect grace, and rematch controls remain usable.

## Debug Flags

1. Open without query flags and confirm no online debug controls are visible.
2. Open with `?debugOnline=1`.
3. Confirm room code, player ID context, state version, latency, last rejection reason, and force snapshot controls are visible only in this mode.
4. Confirm `?debugPhysics=1` and `?debugBot=1` remain separate from online debug.

## Regression

1. Local 2P still starts and resolves shots.
2. Vs Bot still shoots and changes turns.
3. Free Capture still scores.
4. Practice and Tutorial still reset safely.
5. Challenge mode still records result state.
6. Cosmetics still apply and persist.
7. Settings still persist.

## Known MVP Limits

- Sessions restore only while the Node server process still has the room in memory.
- Rate limits are lightweight per-socket cooldowns, not account-level abuse controls.
- Public matchmaking is casual-only and memory-only.
- Reconciliation favors authoritative snap after server settle over complex interpolation.
