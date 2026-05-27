# 3D Carrom Royale - Standalone Release Notes

## Active Source

- Standalone source folder: `C:\Users\shiva\OneDrive\carron3d_new`
- This Phase 16 pass does not touch GameHub, the old GameHub carrom folder, or chess-codex.

## Commands

- Development: `npm run dev`
- Production build: `npm run build`
- Static preview after build: `npm run preview`
- Build output folder: `dist`

## Included Features

- Premium 3D carrom board with flat, custom 2D physics.
- Local 2-player Classic mode with Casual, Standard, and Strict rule variants.
- Coin-side options for Classic: P1 White, P1 Black, Random, and Open / First Pocket.
- Free Capture mode with any-coin scoring and queen bonus.
- Human vs Bot mode with Easy, Normal, and Hard difficulty.
- First-time onboarding, tutorial flow, free practice, pocket drill, and queen cover drill.
- Solo challenge mode with local star progress.
- Cosmetic customization for board, coins, striker, table environment, and VFX style.
- Mobile responsive HUD, side panel, settings, rules, result, challenge, and customize surfaces.

## Local Storage Keys

- `gamehub.carrom3d.settings`
- `gamehub.carrom3d.playerNames`
- `gamehub.carrom3d.challengeProgress`
- `gamehub.carrom3d.onboardingSeen`
- `gamehub.carrom3d.tutorialCompleted`
- `gamehub.carrom3d.practiceStats`
- `gamehub.carrom3d.cosmetics`

## Debug Flags

- `?debugPhysics=1` enables hidden physics debug controls and the `T` dev test shot shortcut.
- `?debugBot=1` enables bot planning debug logging.
- Debug controls are hidden in normal mode.

## Assets And Source Folders

- App entry: `src/main.js`
- Main app coordinator: `src/carrom3d-app.js`
- Scene and Three.js systems: `src/scene`
- Physics systems: `src/physics`
- Rules and match state: `src/game`
- Bot systems: `src/bot`
- Tutorial/practice systems: `src/training`
- Challenge systems: `src/challenges`
- Cosmetic systems: `src/cosmetics`
- UI systems and styles: `src/ui`, `src/styles.css`

## Manual GameHub Integration Reminder

- Integrate manually later from this standalone source only after a fresh standalone build passes.
- Copy or package the `dist` output according to the future GameHub route requirements.
- Keep relative asset paths; the current build script uses `vite build --base=./ --configLoader native`.
- The old GameHub carrom folder was not touched during this standalone release pass.
