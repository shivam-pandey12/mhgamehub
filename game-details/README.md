# Game Details

This folder stores optional metadata for games inside the [`games/`](../games) folder.

How it works:

- Add an `.html` file directly inside `games/`
- Or add a folder game like `games/my-game/dist/index.html` or `games/my-game/index.html`
- Add a matching `.json` file here with the same base filename or folder name
- The website will pick it up automatically from `/api/games-catalog`

Examples:

- `games/flappy-mech.html` -> `game-details/flappy-mech.json`
- `games/color rush.html` -> `game-details/color rush.json`
- `games/battlefield game/dist/index.html` -> `game-details/battlefield game.json`

Useful fields:

- `name`
- `subtitle`
- `description`
- `ageRating`
- `category`
- `type`
- `thumbnail`
- `accent`
- `accentAlt`
- `mark`
- `order`
- `visible`

If no metadata file exists, the website will still add the game automatically using fallback values from the file name and HTML title.
