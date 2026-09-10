# Danger Dave: Pac Edition 🕹️

A browser platformer that mashes up **Dangerous Dave** (run, jump, collect,
avoid enemies) with **Pac-Man** theming (dots, diamonds, a power pellet, and
ghosts you can eat while powered up).

Pure HTML/CSS/JavaScript, no build step, no external assets or dependencies —
just open `index.html` or deploy it as a static site.

## How to play

- **← / →** or **A / D** — move
- **↑ / Space / W** — jump
- Collect every **dot** (small yellow circles) and every **diamond** (cyan
  gems) in the level, then reach the **🏆 trophy** to advance.
- Touching a **ghost** costs you a life — unless you've grabbed the pulsing
  **cyan power pellet**, which turns the hunt around: for a few seconds you
  can eat ghosts for bonus points (they respawn after a short delay).
- You have 3 lives and 3 increasingly tricky levels. Your best score is saved
  locally in your browser (`localStorage`) as your high score.
- Press **Enter** (or click the canvas) on the title, game-over, or win
  screen to start/restart.

## Files

```
danger-dave-pac/
├── index.html   # page structure + HUD
├── style.css    # retro arcade styling
├── game.js      # all game logic (physics, levels, rendering, loop)
└── README.md    # this file
```

## Running locally

Just open `index.html` in any modern browser. No server or build tools
required.

If your browser blocks local file access for some features, you can also
serve it with any static server, e.g.:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repository and push these files to it (see below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   pick the `main` branch and `/ (root)` folder, then **Save**.
4. After a minute, your game will be live at
   `https://<your-username>.github.io/<repo-name>/`.

### Pushing this project to GitHub

```bash
cd danger-dave-pac
git init
git add .
git commit -m "Danger Dave: Pac Edition - initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Customizing

- **Levels** live in `buildLevels()` in `game.js` — each level is just a list
  of platform rectangles, dot/diamond positions, a power pellet, ghost patrol
  ranges, and start/trophy coordinates. Add more entries to the returned
  array to add levels.
- **Physics** (gravity, jump strength, move speed) are constants near the top
  of `game.js`.
- **Colors/look** are in `style.css` and the `draw*` functions in `game.js`.

Have fun, and good luck getting past the ghosts! 👻
