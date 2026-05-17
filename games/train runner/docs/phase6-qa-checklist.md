# Train Roof Rush Phase 6 QA Checklist

## Startup
- Loading screen appears before the menu.
- Missing or corrupt localStorage data falls back safely.
- Main menu opens without stale HUD or gameplay overlays.

## Menus
- Main Menu, Level Select, Daily Challenge, Gear Room, Records, Controls, and Settings open and return cleanly.
- Locked routes cannot be started.
- Settings persist after reload, including performance mode, VFX, shake, touch controls, reduced motion, mute, and UI scale.

## Gameplay
- Movement, train bounds clamp, jump gaps, slide, dodge, attack, special, pickups, obstacles, enemies, elite, boss, set pieces, damage, game over, and victory summary remain functional.
- Pause freezes gameplay and Escape resumes or backs out correctly.
- Retry, next route, daily restart, menu return, and level select return clear spawned hazards, enemies, boss warnings, VFX, and stale UI.

## Mobile And Responsive
- Touch/coarse-pointer devices show swipe plus action controls.
- Browser scrolling is blocked during gameplay gestures.
- Mobile portrait shows the rotate-device hint.
- HUD, controls panel, objectives, warnings, boss bars, menus, Gear Room, records, settings, and summary do not overlap at common desktop, laptop, tablet, and mobile landscape widths.

## Progression
- Route completion, best records, coins, upgrades, weapons, skins, cosmetics, achievements, daily best score, and settings save through `ProgressSystem`.
- Storage failure uses in-memory progress and shows a non-blocking warning.
- Reset progress restores defaults without crashing.

## Performance
- Performance mode lowers render pressure and shadow cost.
- Reduced VFX/reduced motion settings visibly soften particles, shake, and transitions.
- Shell screens keep gameplay systems paused.
- Repeated restarts do not leave obvious enemy, obstacle, pickup, boss, projectile, or particle buildup.

## Build
- `npm.cmd run build` passes.
- Dev server serves `http://127.0.0.1:5173/` successfully.
