export function startRoomCleanup(store, io, intervalMs = 60_000, matchmaking = null, botProcessor = null, log = () => {}, onRoomRemoved = null) {
  const timer = setInterval(() => {
    const removedCodes = store.cleanupStaleRooms();
    const expiredQueues = matchmaking?.cleanup?.() || [];
    botProcessor?.clearClosedRooms?.();
    removedCodes.forEach((roomCode) => {
      onRoomRemoved?.(roomCode);
      io.to(roomCode).emit('room:closed', {
        message: 'Room expired.',
        roomCode
      });
      io.in(roomCode).socketsLeave(roomCode);
      botProcessor?.clear?.(roomCode);
    });
    if (removedCodes.length || expiredQueues.length) {
      log('cleanup.tick', {
        removedRooms: removedCodes.length,
        expiredQueues: expiredQueues.length
      });
    }
  }, intervalMs);
  timer.unref?.();
  return timer;
}
