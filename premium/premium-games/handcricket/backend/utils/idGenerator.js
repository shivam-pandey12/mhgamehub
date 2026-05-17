const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Create a short room code.
 *
 * @param {(candidate: string) => boolean} isAvailable
 * @param {number} [length]
 * @returns {string}
 */
export function createRoomId(isAvailable, length = 6) {
  let roomId = "";
  let attempts = 0;
  const maxAttempts = 100;

  do {
    roomId = Array.from({ length }, () => ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)]).join("");
    attempts += 1;

    if (attempts >= maxAttempts && !isAvailable(roomId)) {
      throw new Error("Unable to allocate a unique room code.");
    }
  } while (!isAvailable(roomId));

  return roomId;
}
