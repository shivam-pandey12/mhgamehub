export const GAME_METADATA = {
  title: 'Ivory Golf Royale 3D',
  description: 'Premium local and online trick-shot mini golf with Ivory Garden and Sky Marble courses.',
  genre: 'Sports / Arcade',
  modes: ['Solo Course', 'Time Trial', 'Challenge', 'Local 2 Player', 'Vs Bot', 'Practice', 'Online Private', 'Online Public'],
  difficulty: 'Beginner to challenge',
  tags: ['3D', 'Mini Golf', 'Sports', 'Local Multiplayer', 'Online Rooms', 'Trick Shots'],
  thumbnail: 'ivory-golf-royale-3d',
  supportedInput: ['Mouse', 'Touch', 'Keyboard buttons'],
  onlineSupport: 'Optional Socket.IO private rooms and public matchmaking; local modes work offline.'
};

export function emitGameHubEvent(type, payload = {}) {
  const event = { type, game: GAME_METADATA.title, payload };
  try {
    window.GameHub?.emit?.(event);
    window.parent?.postMessage?.({ source: 'gamehub-game', ...event }, '*');
  } catch {
    // GameHub hooks are optional.
  }
}

export function goBackToGameHub(fallback = () => {}) {
  try {
    if (window.GameHub?.back) {
      window.GameHub.back();
      return;
    }
    window.parent?.postMessage?.({ source: 'gamehub-game', type: 'game_back' }, '*');
  } catch {
    // Fallback below keeps the game usable outside GameHub.
  }
  fallback();
}
