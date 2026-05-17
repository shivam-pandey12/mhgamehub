// @ts-check

const issuedRoomCodes = new Set();

export function createId(prefix = "id") {
  const slice = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${slice}`;
}

export function registerRoomCode(code) {
  issuedRoomCodes.add(code);
}

export function isRoomCodeRegistered(code) {
  return issuedRoomCodes.has(code);
}

export function createRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  do {
    code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (issuedRoomCodes.has(code));

  issuedRoomCodes.add(code);
  return code;
}
