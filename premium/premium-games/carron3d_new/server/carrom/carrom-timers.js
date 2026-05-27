export const ONLINE_TIMER_DEFAULTS = {
  TURN_TIME_MS: 60_000,
  TURN_WARNING_MS: 10_000,
  DISCONNECT_GRACE_MS: 60_000,
  LOBBY_DISCONNECT_GRACE_MS: 30_000,
  LOBBY_IDLE_CLEANUP_MS: 600_000,
  ROOM_EMPTY_CLEANUP_MS: 120_000,
  FINISHED_ROOM_CLEANUP_MS: 300_000,
  QUEUE_ENTRY_TIMEOUT_MS: 120_000,
  STALE_SESSION_MS: 300_000
};

export function startRoomCleanupTimer(roomManager, intervalMs = 60_000) {
  const timer = setInterval(() => {
    roomManager.cleanupExpired();
  }, intervalMs);
  timer.unref?.();
  return timer;
}

export function createTimeout(callback, ms) {
  const timer = setTimeout(callback, ms);
  timer.unref?.();
  return timer;
}

export function createInterval(callback, ms) {
  const timer = setInterval(callback, ms);
  timer.unref?.();
  return timer;
}
