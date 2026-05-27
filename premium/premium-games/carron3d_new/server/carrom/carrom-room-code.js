const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_CODE_LENGTH = 5;

export function createRoomCode(existingCodes = new Set()) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let code = '';
    for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
      code += ROOM_CODE_ALPHABET[Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)];
    }
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  return `${Date.now().toString(36).slice(-ROOM_CODE_LENGTH)}`.toUpperCase();
}

export function normalizeRoomCode(value = '') {
  return String(value).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export function isValidRoomCode(value = '') {
  return /^[A-HJ-NP-Z2-9]{5,6}$/.test(normalizeRoomCode(value));
}
